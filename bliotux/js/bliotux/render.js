/* File: render.js
 * 
 * Copyright (c) 2009
 * by Jean Millerat, 8 square de Batz, 78310 MAUREPAS
 * (Jean.Bliotux@wecena.com)
 * 
 * GNU Affero General Public License (AGPL)
 * 
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 * 
 */
//alert('render.js loading');

// identifier of the page
var defaultPageName = "tableOfContentsExample"; 
var pageName = getUrlParameter(window.location.href, 'page', defaultPageName);

// identifiers for the corresponding offline storage engine
var appName = "bliotux";
var storageName = pageName;
var projectName = appName + '.' + storageName;

// svg document
var svg;

/* Workaround variables for bugs in jstore
 * see http://code.google.com/p/jquery-jstore/issues/detail?id=21
 * and http://code.google.com/p/jquery-jstore/issues/detail?id=24
 */
var emptyString = '-+-emptyString-+-';
var zero = '-+-zero-+-';

/* This variable is defined here but its value should be assigned to
 * it in the page-specific data.js file.
 * var template = 'theNameOfMyTemplate.svg';
 */
var template;

/* This variable contains page-specific data.
 */ 
var pageData;

/* Page-specific data will be mixed with default values taken
 * from the template data. The result is the "data" variable.
 */
var data;

/* In case the template interaction.js file does not defined this
 * function (it should).
 */
function initPage() {
	// do nothing, the template should override this function
}

/* In case the template model.js file does not defined this
 * function (it should).
 */
function manipulate(svgRoot) {
	// do nothing, the template should override this function
}

// Set preferred jStore engines
var engines = ['gears', 'html5', 'ie', 'local', 'session'];
// the 'flash' engine does not work with local file:// pages

// Initialize jStore parameters
jQuery.extend(jQuery.jStore.defaults, {
    project: projectName,
    engine: engines[0]
});

// Replace the normal jQuery getScript function with one that supports
// debugging and which references the script files as external resources
// rather than inline.
// Found here : http://stackoverflow.com/questions/690781/debugging-scripts-added-via-jquery-getscript-function
jQuery.extend({
   getScript: function(url, callback) {
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.src = url;

      // Handle Script loading
      {
         var done = false;

         // Attach handlers for all browsers
         script.onload = script.onreadystatechange = function(){
            if ( !done && (!this.readyState ||
                  this.readyState == "loaded" || this.readyState == "complete") ) {
               done = true;
               if (callback)
                  callback();

               // Handle memory leak in IE
               script.onload = script.onreadystatechange = null;
            }
         };
      }

      head.appendChild(script);

      // We handle everything using the script element injection
      return undefined;
   }
});


/* Fired when the jStore offline/local storage library is ready
 * to prepare a storage engine.
 */
jQuery.jStore.ready(function(engine){
    var engine = jQuery.jStore.CurrentEngine;
    //alert('jStore ready, with engine ' + engine.jri);
    
    /* Fired when the storage engine is ready. */
    engine.ready(function(){
        //alert('engine ready ' + engine.jri);
    });
    
    /* Event fired when the engine had to include third party
     * libraries. Which should not occur (for offline use).
     */
    engine.included(function(){
        alert(engine.jri + ' had to include online libraries.');
    });
    
    /* Fired when/if the flash object is ready
     * to prepare the flash storage engine */
    jQuery.jStore.flashReady(function(){
        alert('flashReady');
        // Finally, we need to wait for the storage engine to be ready.  
        // Once this function is called, you can use the jStore interface synchronously  
    });
});

// In case jStore fails at loading a storage engine
jQuery.jStore.fail(function(engine){
    var currentEngineName = engines[0];
    var alertMsg = "jStore failed with engine " + currentEngineName + "!\n" +
    "(" +
    engine.jri +
    "). Maybe this engine is not available in your web browser? \n";
    if (currentEngineName == 'gears') {
        alertMsg += "You can download Google Gears from http://gears.google.com/ " +
        "except maybe if you are behind a coporate firewall and proxy.\n";
    }
    // Find an alternative engine from the list of preferred engines
	var success = false;
	var nextEngine;
	var index;
    for (index in engines) {
		nextEngine = engines[index];
		if (nextEngine == currentEngineName) {
			// do not retry the same engine, try the next one
			continue;
		}
        alertMsg += "Retried with the '" + nextEngine + "' engine. ";
        try {
            jQuery.jStore.use(nextEngine, storageName, appName);
        } 
        catch (e) {
            if (e == "JSTORE_ENGINE_UNAVILABLE") {
                alertMsg += "Oops, '" + nextEngine + "' is not available !\n";
            }
            else {
                alertMsg += "Oops, " + e + " exception !";
				alert(e);
            };
            continue; // try next engine
        }
		// Let's set this engine as the current one to be used.
		success = true;
        var nextEngineJri = appName + '.' + storageName + '.' + nextEngine;
        alertMsg += 'New engine at ' + jQuery.jStore.Instances[nextEngineJri];
        jQuery.jStore.setCurrentEngine(nextEngineJri);
    };
	if (success == false) {
        alertMsg += "\nNo suitable jStore engine could be found. " +
        "You should still be able to use these pages but " +
        "they will be reset before next time you access them.";
	}
    alert(alertMsg);
});

/* This function returns the value of a parameter in the URL.
 * For instance :
 * getUrlParameter('index.html?key=value','key') will return 'value'
 */
function getUrlParameter(url,parameterName,defaultValue){
    parameterName = parameterName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + parameterName + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results == null)
        return defaultValue;
    else
	    var result = results[1];
		if (result == null)
		    return defaultValue;
        return result;
}


/*
 * Will store the contents of external files as they are loaded.
 */
var externalFileContents = {};

/*
 * Here will be stored handler functions defined by the template
 * model. Keys are the names of files to be handled.
 */
var fileHandlers = {};


/* Callback after an svg file is loaded
 * svgElement is the document element of the loaded file.
 */
function onSvgFileLoad(svgElement, error){
    //alert('svgElement : ' + svgElement + '\n' + 'error : ' + error);
	var fileName = svgElement.root().parentNode.getAttribute("fileName");
	var content = $('g',svgElement.root());
	externalFileContents[fileName] = content;
	fileHandlers[fileName](content);
    // take the first group in this svg document
    //var svgPart = $('g', svgElement.root());
    // locate the piece to be replaced in the target svg document
    //var target = $(svgSelector, svg.root());
    // do the replacement
    //target.replaceWith(svgPart);
    // get rid off the temporary HTML div
    //document.body.removeChild(svgDiv);
    // check for pieces to be replaced in the newly loaded part
    updateSvg(svgElement);
}

/*
 * Inserts the contents of an SVG file in a document.
 * 
 *   fileName : the name of the input file is given as first
 *   parameter. This file should be located in the page folder.
 *   
 *   selector : the jQuery selector which locates where the content
 *   of the file should be inserted in the resulting document
 *   
 *   root: the root of the document to insert contents into
 *   
 */
function insertSvgFile(fileName, selector, root) {
	
	// was this file already handled ?
	if (externalFileContents[fileName] != undefined) {
		// yes, already handled.
		return
	}
	
	// define the handler which will insert content once available
	function handler(content) {
			try {
				$(selector, root).html(content);
			} catch (e) {
				alert(e);
			};
	};
	// store the handler for future use
	fileHandlers[fileName] = handler;
	
	// then load the SVG file
	var svgFilePath = 'pages/' + pageName + '/' + fileName;
    // create a div to host the svg document to be loaded from svgPartPath
    var svgDiv = document.createElement("div");
	var divId = 'svgHere';
    svgDiv.setAttribute('id', divId);
	svgDiv.setAttribute('fileName', fileName);
    document.body.appendChild(svgDiv);
    // use this div to host the svg document
    $('#'+divId).svg();
    var svgElement = $('#' + divId).svg('get');
    // load the svg document in the div
    svgElement.load(svgFilePath, {
		addTo: true,
		changeSize: false,
		onLoad: onSvgFileLoad
	});
}

/* This function updates the svg document using
 * selectors and their associated value in data.
 */
function updateSvg(svgElement){
	// Fill the template with data using the manipulate function from the template
    manipulate(svgElement.root());
	// Re-initialize the page once SVG is updated
	initPage();
}

/* Load and return value associated to key from local offline storage
 * or return null if key is not found or an exception occured.
 */
function storageLoad(key){
    //alert('loading ' + key);
    var engine = $.jStore.CurrentEngine;
    if (engine == null) {
        // no engine was loaded
        return null;
    }
    if (engine.isReady == false) {
        // engine is not ready
        return null;
    }
    var value = engine.get(key);
	if (value == emptyString) {
		return '';
	} else if (value == zero) {
		return 0;
	}
    return value;
}

// Save key, value pair in local offline storage
function storageSave(key, value){
    //alert('saving ' + key + ' = ' + value);
    var engine = $.jStore.CurrentEngine;
	if (engine != null) {
		if (engine.isReady == true) {
			if (value == '') {
				value = emptyString;
			}
			else 
				if (value == '0') {
					value = zero;
				}
			engine.set(key, value);
		}
	}
}

/* Called once the template's model.js file is loaded.
 * 'message' is some message from the caller.
 */
function loadSVG(message) {
	/* Let's override default values defined by the model
	 * with page-specific values.
	 */
	for (key in pageData) {
		data[key] = pageData[key];		
	}
    // add the SVG file from the template defined in the caller script (data.js)
    $('#svgload').svg();
    svg = $('#svgload').svg('get');
    var svgTemplate = 'templates/' + template + '/layout.svg';
    svg.load(svgTemplate, {
        addTo: true,
        changeSize: false,
        onLoad: updateSvg
    });
}


/*
 * This function will be called once data.js is loaded for this page.
 * 
 * callbackOnModelLoad is a callback function which will be called once
 * the template model is loaded. 
 */
function loadModel(callbackOnModelLoad){
    //alert(response);
    
	// now we know which template should be used
	
	/* Let's keep the data.js file aside so that it's not
	 * overriden by the default values taken from the template
	 * model.
	 */
	pageData = data;
	
    // load the template interaction script if any    
    var templateInteraction = document.createElement("script");
	templateInteraction.id = "templateInteraction";
    var templateInteractionSrc = 'templates/' + template + '/interaction.js';
	templateInteraction.src = templateInteractionSrc;
    templateInteraction.type = "text/javascript";
    //document.body.appendChild(templateInteraction);
	jQuery.getScript(templateInteractionSrc);
    
    // load the template model script if any    
    var templateModel = document.createElement("script");
	templateModel.id = "templateModel";
    var templateModelSrc = 'templates/' + template + '/model.js';
	templateModel.src = templateModelSrc;
    templateModel.type = "text/javascript";
    //document.body.appendChild(templateModel);
	jQuery.getScript(templateModelSrc, function () {
		callbackOnModelLoad();
	});

};

/* Load the data.js script corresponding to the page indicated as
* the 'page' parameter in the URL
* index.html?page=Sesamath_CP_page-094_exercice-001
*
* callbackOnDataLoad is a callback function which will be called once
* the page data is loaded. 
* callbackOnModelLoad is a callback function which will be called once
* the template model is loaded. 
*/

function loadData(callbackOnDataLoad,callbackOnModelLoad) {
    var dataScript = document.createElement("script");
	dataScript.id = "dataScript";
    var dataScriptSrc = 'pages/' + pageName + '/data.js';
	dataScript.src = dataScriptSrc;
    dataScript.type = "text/javascript";
	jQuery.ajax({url:dataScriptSrc,
				dataType:'script',
				async: true
	});	
	// this script should then call loadModel()
    
	jQuery.ajax({url:'pages/'+pageName+'/template.txt',
	             dataType:'text',
    	         success: function(response) {
				 	template = response;
					callbackOnDataLoad(callbackOnModelLoad);
				 },
				 error: function() {
				 	// retry with splitting the pageName in case an upper directory
					// defines a default template
				 	jQuery.ajax({url:'pages/'+pageName.split('/')[0]+'/default_template.txt',
			             dataType:'text',
		    	         success: function(response) {
						 	template = response;
							callbackOnDataLoad(callbackOnModelLoad);
						 },
			    	     async: true
			         });
				 },
	    	     async: true
	});
    // Load the offline storage framework
    try {
        //jQuery.jStore.load();
    } 
    catch (e) {
        alert(e);
    }
}

$(function(){
	loadData(loadModel,loadSVG);
});
//alert('render.js loaded');