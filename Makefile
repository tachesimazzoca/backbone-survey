ARTIFACT=backbone-survey

all: build

.PHONY: build
build: node_modules bower_components checkstyle
	@install -d build/
	@rm -rf build/*
	@cp -R src/* build/.
	@install -d build/lib/json2
	@cp bower_components/json2/json2.js build/lib/json2/.
	@install -d build/lib/jquery
	@cp bower_components/jquery/jquery.min.js build/lib/jquery/jquery.min.js
	@install -d build/lib/underscore
	@cp bower_components/underscore/underscore-min.js build/lib/underscore/.
	@install -d build/lib/backbone
	@cp bower_components/backbone/backbone-min.js build/lib/backbone/.
	@cd build/assets/js/ && cat core.js enum.js validators.js models.js templates.js views.js > $(ARTIFACT).js
	@./node_modules/.bin/uglifyjs -nc build/assets/js/$(ARTIFACT).js > build/assets/js/$(ARTIFACT).min.js

.PHONY: checkstyle
checkstyle: node_modules
	@./node_modules/.bin/jshint src/assets/js/*.js --config src/.jshintrc
	@./node_modules/.bin/jshint src/tests/unit/*.js --config src/.jshintrc
	@./node_modules/.bin/jshint contrib/card/js/*.js --config src/.jshintrc
	@./node_modules/.bin/jshint contrib/slider/js/*.js --config src/.jshintrc

.PHONY: docs 
docs:
	@./node_modules/.bin/yuidoc -o build/docs src/assets/js

.PHONY: contrib 
contrib:
	@cp -R contrib build/.

.PHONY: clean
clean:
	@rm -rf build/
	@rm -rf bower_components/

node_modules:
	@npm install

bower_components:
	@bower install
