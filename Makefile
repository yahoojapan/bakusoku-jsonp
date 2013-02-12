MUSTACHE = vendor/mustache.js/mustache.js
BAKUSOKU = src/bakusoku-jsonp.js
MINIFIER = yuicompressor

SRC = $(MUSTACHE) $(BAKUSOKU)
VERSION = 1
COMBINE = build/bakusoku-jsonp-v$(VERSION).js
MINIFY = build/bakusoku-jsonp-v$(VERSION)-min.js

all: $(MINIFY)

$(COMBINE): $(SRC)
	echo "if (typeof Mustache == 'undefined') {" > $@
	cat $(MUSTACHE) >> $@
	echo "}" >> $@
	cat $(BAKUSOKU) >> $@

$(MINIFY): $(COMBINE)
	$(MINIFIER) $(COMBINE) > $@

.PHONY: clean

clean:
	rm -f $(COMBINE) $(MINIFY)
