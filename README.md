## Announcement

このプロジェクトは現在保守しておりません。今後のIssueやPull requestには対応できません。  
これまでサポートいただいた皆さまに感謝申し上げます。ありがとうございました。
  
This project is no longer maintained. Further issue reports and/or pull requests will not be accepted. Thank you for your contribution to this project.
  
爆速JSONP
=============================================
http://techblog.yahoo.co.jp/programming/bakusoku-jsonp/

## Introduction

JSONPのWeb APIを手軽に使うためのフレームワークです。JavaScriptを書かずに、WebAPIを使ったブログパーツを作ることができます。

## Example

HTMLに以下のようなscriptタグを書いておくと、自動的にdata-XXXで設定されたWeb API(JSONP形式に対応したもの)にリクエストし、その結果でHTMLを作り出力します。

```html
<script src="path/to/bakusoku-jsonp-v1.js"
  data-api="http://example.com/some-webapi"
  data-p-param1="parameter">
Hello {{response}}!!
</script>
```

↓ 

```
HTTP/1.1 200 OK
Content-Type: application/json

{"response":"WebAPI"}
```

↓ 

```html
<div>
Hello WebAPI!!
</div>
```

## License

MITライセンスにて提供しています。詳しくはLICENSEをご覧ください。
