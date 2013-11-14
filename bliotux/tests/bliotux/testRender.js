test('getUrlParameter', function() {
	equals(getUrlParameter('http://somehost:01234/pouet?clef1=&clef2=valeur2&clef3=','clef2','someDefault'), 'valeur2', 'clef2 has valeur2 as value');
	equals(getUrlParameter('','clef2','someDefault'), 'someDefault', 'The URL is empty');
	equals(getUrlParameter('http://somehost:01234/pouet?clef1=&clef2=valeur2&clef3=','clef1','someDefault'), '', 'clef1 value is empty');
	equals(getUrlParameter('http://somehost:01234/pouet?clef1=&clef2=valeur2&clef3=','clef4','someDefault'), 'someDefault', 'There is no clef4 in this URL');
});

test('initialization', function () {
	equals(pageName, 'tableOfContentsExample', 'default pageName');
	equals(appName, 'bliotux', 'default appName');
	equals(storageName, 'tableOfContentsExample', 'storageName should be the same as pageName');
	equals(projectName, 'bliotux.tableOfContentsExample', 'default project name');
	/*:DOC += <div id="load" class="feature"><div id="svgload" class="svgdiv"><img src="/images/FrontPage.svg"></img></div></div> */
    assertNotNull(document.getElementById('load'));
    equals(jQuery.jStore.defaults, {"project":"bliotux.tableOfContentsExample","engine":"gears","autoload":true,"flash":"jStore.Flash.html"}, 'jStore defaults updated');
});

test('loadData', function () {
	jQuery.getScript = function(url, callback) {
		equals(url,"pages/tableOfContentsExample/data.js","the URL of the data.js script");
		if (callback != undefined) {
			callback("some response");
		};
	};
	var callbackOnDataLoad = function (callbackOnModelLoad) {
		equals(callbackOnModelLoad,'someCallbackOnModelLoad','the onModelLoad callback');
	};
	loadData(callbackOnDataLoad,"someCallbackOnModelLoad");
	expect(2);
});

test('loadModel', function() {
	template = "someTemplate";
	// let's override jQuery.getScript and make sure it is called
	// twice and with proper args
	var getScriptCalls = 0;
	jQuery.getScript = function (url, callback) {
		getScriptCalls += 1;
		ok(getScriptCalls<3,"jQuery.getScript should be called twice only");
		if (getScriptCalls == 1) {
			equals(url,"templates/someTemplate/interaction.js", "URL of the template interaction.js script");
			equals(callback,undefined,"callback");
		} else if (getScriptCalls == 2) {
			equals(url,"templates/someTemplate/model.js","URL of the template model.js script");
			callback();
		} else {
			ok(false,"getScriptCall should be equal either to 1 or 2");
		};
	};
	var finalCallbackCalled = false;
	var someCallbackOnModelLoad = function() {
		finalCallbackCalled = true;
	};
	loadModel(someCallbackOnModelLoad);
	ok(finalCallbackCalled,"Final callback should be called");
	expect(6);
});

test('loadSVG', function () {
	var data = {};
	var pageData = {'someKey': "someValue"};
	var svgCalls = 0;
	$ = function (selector) {
		equals(selector,'#svgload',"id of the svg load element");
		var result = {};
		result['svg'] = function (argument) {
			svgCalls += 1;
			if (svgCalls == 1) {
				equals(argument,undefined,"argument svg is first called with");
			} else if (svgCalls == 2) {
				equals(argument,"get","argument svg is called with at second time");
				var svgElement = {};
				svgElement['load'] = function (svgTemplate, arguments) {
					equals(svgTemplate,"templates/someTemplate/layout.svg");
					equals(arguments['addTo'],true,'addTo');
			        equals(arguments['changeSize'],false,'changeSize');
			        equals(arguments['onLoad'],updateSvg,'onLoad function call');
				};
				return svgElement;
			} else {
				ok(false,"svg() should not be called more than twice");
			};
		};
		return result;
	};
	loadSVG("someMessage");
	//equals(data['someKey'],'someValue',"data['someKey']");
	expect(8);
});

test('insertSvgFile',function () {
	var someAlreadyHandledFileName = "someAlreadyHandledFileName";
	externalFileContents['someAlreadyHandledFileName'] = true;
	var someSelector = "someSelector";
	var someRoot = "someRoot";
	var svgCalls = 0;
	$ = function(someSelector2,someRoot2) {
		if (someSelector2 == "someSelector" && someRoot2 == "someRoot") { 
			var result = {};
			result['html'] = function (someContent) {
				equals(someContent,"someContentOfMine","someContent");
			};
			return result;
		} else if (someSelector2 == "#svgHere") {
			var result = {};
			result['svg'] = function (svgArgument) {
				svgCalls += 1;
				if (svgArgument == undefined) {
					equals(svgCalls,1,"svgCalls");
				} else if (svgArgument == "get") {
					equals(svgCalls,2,"svgCalls");
					var result = {};
					result['load'] = function (somePath, someArgs) {
						equals(somePath,"pages/tableOfContentsExample/someNewFileName","somePath");
						equals(someArgs,{addTo: true, changeSize: false, onLoad: onSvgFileLoad},"someArgs");
					};
					return result;
				} else {
					ok(false,"should not be called");
				}
			};
			return result;
		} else {
			ok(false,"this sould not be called");
		};
	};
	var document = {};
	document.createElement = function (elementName) {
		equals(elementName,"div","elementName");
		var someSvgDiv = {};
		someSvgDiv['setAttribute'] = function (attributeName,attributeValue) {
			someSvgDiv[attributeName] = attributeValue;
			if (attributeName == "id") {
				equals(attributeValue,"svgHere2","attributeValue for divId");
			} else if (attributeName == "fileName") {
				equals(attributeValue,"theFileName","attributeValue for fileName");
			} else {
				ok(false,"Do not disturb, please");
			};
		};
		return someSvgDiv;
	};
	document.body = {};
	document.body['appendChild'] = function (someElement) {
		document[someElement] = true;
	};
	insertSvgFile(someAlreadyHandledFileName, someSelector, someRoot);
	equals(svgCalls,0,"svgCalls");
	equals(fileHandlers['someAlreadyHandledFileName'],undefined,"fileHandlers['someAlreadyHandledFileName']");
	var someNewFileName = "someNewFileName";
	insertSvgFile(someNewFileName, someSelector, someRoot);
	equals(svgCalls,2,"svgCalls");
	var newHandler = fileHandlers['someNewFileName'];
	newHandler('someContentOfMine');
	expect(0);
});