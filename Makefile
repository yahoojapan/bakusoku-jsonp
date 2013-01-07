MUSTACHE = vendor/mustache.js/mustache.js
BAKUSOKU = src/bakusoku-jsonp.js
MINIFYER = yuicompressor

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
	$(MINIFYER) $< > $@

.PHONY: clean

clean:
	rm -f $(COMBINE) $(MINIFY)

test:
	php -S localhost:8080
