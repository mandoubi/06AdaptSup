/* File: model.js
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

/*
 * This file defines how the page-specific data structure
 * will trigger DOM manipulation of the page.
 * 
 */ 

/*
 * Here are the default values for this template.
 * Copy and paste this data variable to the data.js file
 * of your page and fill it with the values you want for your page.
 * 
 */
data = {
	// Page title
	'title': '',
	
	// Text
	'text': ''
};

/*
 * Here is how this template is filled with page-specific data.
 * 
 * More precisely, the following function defines how the page
 * document object is manipulated according to the page-specific
 * data (the 'data' variable defined in the page data.js file) and
 * according to the structure of the corresponding template.
 * 
 */

function manipulate(root) {
	
	// load text and title
	var title = data["title"];
	if (title==undefined || title=='') {
		jQuery.ajax({url:'pages/'+pageName+'/title.txt',
             dataType:'text',
             success: function(response) { title = response; },
	         async: false
			});
	};
	var text = data["text"];
	if (text==undefined || text=='') {
		jQuery.ajax({url:'pages/'+pageName+'/text.txt',
             dataType:'text',
             success: function(response) { text = response; },
	         async: false
			});
	};
	
	// Fill the title
	$('#title',root).text(title);
	
	// Remove example lines
	var lineNumber = 1;
	while (lineNumber <=6) {
		$('#textLine' + lineNumber,root).replaceWith("");
		lineNumber += 1;
	}
	
	// Now fill the lines from text
	var index = 0;
	var line;
	var lineLength = 80;
	var endOfLine = 0;
	lineNumber = 1;
	var lines = new Array();
	var lineSeparator;
	
	while (index < text.length) {
		// prepare next line
		line = text.slice(index, index + lineLength);
		// Is the remaining text too long to fit the line ?
		if (text.length - index > lineLength) {
			// Then cut the line at its last space
			endOfLine = line.lastIndexOf(" ");
			// BTW is there a space in this line ?
			if (endOfLine > 0) {
				// if so, then do cut
				line = line.slice(0, endOfLine);
			};
		}
		// The line is short enough. But does it contain any \n ?
		lineSeparator = line.indexOf("\n");
		if (lineSeparator > -1) {
			// if so, then do cut just after the newline character.
			line = line.slice(0, lineSeparator + 1);
		}
		// This line is ready, keep it.
		lines.push(line);
		// Get ready for next line (if any)
		index += line.length;
		lineNumber += 1;
	};

    // Add the lines to the templates in new tspans
	
    var numberOfLines = lineNumber - 1;
	lineNumber = 1;
	
	var tspanId;
	var tspanYMin = 111.66666;
	var tspanYMax = 591.66663;
	var tspanY;
	var colorIndex;
	var svgText = svg.createText();
	var className;

	while (lineNumber <= numberOfLines) {
		// Prepare a tspan in the template for this line
		line = lines.pop();
		// What will its ID be ?
		tspanId = "textLine" + lineNumber;
		// What's the vertical position it should have ?
		tspanY = tspanYMin + (tspanYMax - tspanYMin) / (numberOfLines - 1) * (numberOfLines - lineNumber);
		// What's its color ?
		colorIndex = lineNumber % 3;
		className = "textBody line" + colorIndex;
		// Add the tspan to this template
		svgText = svgText.span(line,
							   {"id": tspanId,
							    "x": "18.78125",
								"y": tspanY,
								"class": className});
		lineNumber += 1;
	};
	svg.text(null, "18.78125", "111.66666", svgText, {"class": "textBody"});
};