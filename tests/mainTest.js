function get(id) {
    return document.getElementById(id);
}

asyncTest("Basic Usage", function(){
    equal(get('case1').textContent, 'Hello World 1',
         'simple usage');
    equal(get('case2').textContent, 'Hello World 2',
         'simple usage 2 ok');
    equal(get('case3').textContent, 'Hello World 1+another data',
         'data filtering 1');
    equal(get('case4a').textContent, 'Hello World 1+another data 2',
         'filter function check');
    equal(get('case4b').textContent, 'Hello World 1+another data 3',
         'filter function check');
    equal(get('case6').textContent, 'Timeout!!',
         'error handling');
});


setTimeout(start, 3500);
