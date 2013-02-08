/*!
 * 爆速JSONP-v1 - JSONP WebAPIを手軽に使うためのフレームワーク
 * @copyright Yahoo Japan Corporation
 * @license https://github.com/ydnjp/bakusoku-jsonp/blob/master/LICENSE
 *
 * Includes mustache.js
 * https://github.com/janl/mustache.js
 */
void function(global, document) {
    "use strict";

    var DEFAULT_TIMEOUT = 10 * 1000 //10秒
      , script = getScriptTag();

    void function main() {
        var attrs = script.attributes
          , i, len, attr
          , filter, timeout
          , cblabel
          , params = {}
        ;

        //パラメータを収集
        for (i=0, len=attrs.length; i<len; i++) {
            attr = attrs[i];
            if (/^data-p-(.+)$/.test(attr.name)) {
                params[RegExp.$1] = attr.nodeValue;
            }
        }

        //filter関数を取得
        if (attrs['data-filter']) {
            filter = namespace(attrs['data-filter'].nodeValue);
            if (typeof filter !== 'function') {
                filter = function(data){ return data };
            }
        } else {
            filter = function(data){ return data };
        }

        //timeoutを取得
        if (attrs['data-timeout']) {
            timeout = attrs['data-timeout'].nodeValue;
        }

        //cblabelを取得
        if (attrs['data-callback-label']) {
            cblabel = attrs['data-callback-label'].nodeValue;
        }

        var request = function(){
            requestJSONP(attrs['data-url'].nodeValue, params, timeout, cblabel, function(data){
                var box
                  , template
                  , credit = ''
                  ;

                //テンプレートを取得
                if (attrs['data-template']) {
                    template = document.getElementById(attrs['data-template'].nodeValue);
                    if (template) {
                        template = template.innerHTML;
                    }
                } else {
                    template = script.innerHTML;
                }

                //APIがYJDNのものであればクレジット表示を追加
                if (/yahooapis\.jp/.test(attrs['data-url'].nodeValue)) {
                    credit = '<a href="http://developer.yahoo.co.jp/about/" style="display:block;width:125px;height:17px;padding:0;margin:4px 0 15px 0">'
                           + '<img src="http://i.yimg.jp/images/yjdn/yjdn_attbtn1_125_17.gif" title="Webサービス by Yahoo! JAPAN" alt="Web Services by Yahoo! JAPAN" width="125" height="17" border="0" />'
                           + '</a>';
                }

                if (template) {
                    box = document.createElement('div');
                    box.innerHTML = Mustache.render(
                        template,
                        filter(data)
                    ) + credit;
                } else {
                    //templateが空の場合はデバッグ出力(モダンブラウザのみ)
                    box = document.createElement('pre');
                    box.textContent = JSON.stringify(filter(data), null, "  ");
                }
                console.log(script);
                console.log(script.parentNode);
                script.parentNode.replaceChild(box, script);
            });
        };

        //APIリクエスト
        if (attrs['data-template']) {
            //template指定の場合、scriptタグより後ろにテンプレートがあっても動くよう、実行を遅延させる
            onDomLoaded(request);
        } else {
            //インラインなら即実行
            request();
        }
    }(); //main

    // functions ----------------------------------------------------

    /**
     * このJSファイルを読み込んでいるscriptタグを取得する
     *
     * @example
     *   getScriptTag() // [HTMLNode script]
     */
    function getScriptTag() {
        var scripts = document.getElementsByTagName('script')
          , i = scripts.length - 1;
        for (; i>=0; i--) {
            if (/bakusoku-jsonp.*\.js$/.test(scripts[i].src)) {
                return scripts[i];
            }
        }
    }

    /**
     * JSONPリクエスト関数
     *
     * @param {string}  url      APIのURL(http://から?より前の部分まで)
     * @param {Object}  params   APIに渡すパラメータのハッシュ。buildQuery()を参照
     * @param {number}  timeout  ミリ秒。レスポンスが返ってこなければエラーとして打ち切る
     * @param {string}  cblabel  callbackを指定するパラメータ名。"callback="ではないAPIの場合、ここで変更を指定
     * @param {function(Object)} callback JSONを処理するコールバック関数
     */
    function requestJSONP(url, params, timeout, cblabel, callback) {
        var callbackName = 'yj_callback' + Math.random().toString(36).slice(2,20)
          , req = document.createElement('script')
          , timerId
        ;
        if (!cblabel) cblabel = 'callback';
        if (!timeout) timeout = DEFAULT_TIMEOUT;

        params[cblabel] = callbackName;
        req.type = 'text/javascript';
        req.src = url + '?' + buildQuery(params);

        global[callbackName] = function(data) {
            clearTimeout(timerId);
            req.parentNode.removeChild(req);
            delete global[callbackName];
            return callback(data);
        };

        timerId = setTimeout(function(){
            global[callbackName] = function(){};
            callback({BakusokuError:true});
        }, timeout);

        script.parentNode.insertBefore(req, script.nextSibling);
    }

    /**
     * クエリストリングを組み立てる。
     * PHPのhttp_build_query()に相当する機能
     *
     * @param {Object} hash {パラメータ1: "値1", パラメータ2: "値2", ...} の形式のオブジェクト
     * @example
     *   buildQuery({a: "A", b: "B"}) // 'a=A&b=B'
     *   buildQuery({script: "<script>"}) // 'script=%3Cscript%3E'
     */
    function buildQuery(hash) {
        var queries = [], key, encode = global.encodeURIComponent;
        for (key in hash) if (hash.hasOwnProperty(key)) {
            queries.push(encode(key) + '=' + encode(hash[key]));
        }
        return queries.join('&');
    }

    /**
     * com.example.hoge.fooのようなnamespace記述を解決する
     *
     * @param {string} str 名前空間の文字列
     * @return {Object} 空のオブジェクトか、もしくは解決した参照
     */
    function namespace(str) {
        var names = str.split('.')
          , i, l, n, cur = global
          ;
        for (i=0,l=names.length; i<l; i++) {
            n = names[i];
            cur[n] = cur[n] || {};
            cur = cur[n];
        }
        return cur;
    }

    /**
     * 簡易的なクロスブラウザDOMContentLoaded
     */
    function onDomLoaded(listener) {
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', listener, false);
        } else {
            //IE系はwindow.onloadで妥協
            global.attachEvent('onload', function(){
                listener.call(global, global.event);
            });
        }
    }

}(this, document);
