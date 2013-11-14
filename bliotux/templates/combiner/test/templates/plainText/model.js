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
	
	// Fill the title
	$('#title',root).text(data['title']);
	
	// Remove example lines
	var lineNumber = 1;
	while (lineNumber <=6) {
		$('#textLine' + lineNumber,root).replaceWith("");
		lineNumber += 1;
	}
	
	// Now fill the lines from text
	var index = 0;
	var text = data['text'];
	var line;
	var lineLength = 56;
	var endOfLine = 0;
	lineNumber = 1;
	var lines = new Array();
	
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
		// This line is ready, keep it.
		lines.push(line);
		// Get ready for next line (if any)
		index += line.length;
		lineNumber += 1;
	};

    // Add the lines to the templates in new tspans
	
    var numberOfLines = lineNumber - 1;
	lineNumber = 1;
	
	var tspan;
	var tspanId;
	var tspanYMin = 111.66666;
	var tspanYMax = 591.66663;
	var tspanY;
	var colorIndex;
	var colors = new Array ("#ff0000", "#00ff00", "#0000ff");
	var tspanColor;
	var svgText = svg.createText();

	while (lineNumber <= numberOfLines) {
		// Prepare a tspan in the template for this line
		line = lines.pop();
		// What will its ID be ?
		tspanId = "textLine" + lineNumber;
		// What's the vertical position it should have ?
		tspanY = tspanYMin + (tspanYMax - tspanYMin) / (numberOfLines - 1) * (numberOfLines - lineNumber);
		// What's its color ?
		colorIndex = Math.round(((lineNumber / 3) - Math.floor(lineNumber / 3)) * 3) - 1;
		tspanColor = colors[colorIndex + 1];
		tspan = '<svg:tspan id="' + tspanId + '" ';
		tspan += 'sodipodi:role="line" x="18.78125" ';
		tspan += 'y="' + tspanY + '" ';
		tspan += 'style="fill:' + tspanColor + '">';
		tspan += line + '</svg:tspan>';
		// Add the tspan to this template
			svgText = svgText.span(line, {id: tspanId, x: "18.78125", y: tspanY, fill: tspanColor});
		lineNumber += 1;
	};
	svg.text(null, "18.78125", "111.66666", svgText, {style: "font-size:28px;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;text-align:start;line-height:300%;writing-mode:lr-tb;fill:#000000;fill-opacity:1;stroke:none;font-family:Arial;-inkscape-font-specification:Arial"});
};

onModelLoad("model.js loaded");