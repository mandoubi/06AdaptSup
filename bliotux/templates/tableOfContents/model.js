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
	// Contents maps page names to their display titles
	'contents': []
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
	jQuery.ajax({url:'pages/'+pageName+'/title.txt',
             dataType:'text',
             success: function(response) { $('#title',root).text(response); },
	         async: true
	});
	
	// Remove example lines
	var lineNumber = 1;
	while (lineNumber <=6) {
		$('#link' + lineNumber,root).replaceWith("");
		lineNumber += 1;
	}
	
	// Now fill the lines from text
	var lines;
	jQuery.ajax({url:'pages/'+pageName+'/pages.txt',
             dataType:'text',
             success: function(response) {
			 	var reg=new RegExp("\n", "g");
				lines = response.split(reg);
			 },
	         async: false
	});
	var titles;
	jQuery.ajax({url:'pages/'+pageName+'/titles.txt',
             dataType:'text',
             success: function(response) {
			 	var reg=new RegExp("\n", "g");
				titles = response.split(reg);
			 },
	         async: false
	});
    // Add the lines to the templates in new tspans
	
    var numberOfLines = lines.length;
	lineNumber = 1;
	
	var aId;
	var textId;
	var tspanId;
	var textYMin = 111.66666;
	var textYMax = 500.66663;
	var textY;
	var colorIndex;
	var colorNumber;
	var className;
	var content;
	var url;
	var link;
	var style;
	var text;

	while (lineNumber <= numberOfLines) {
		// Prepare an anchor, text and tspan in the template for this line
		line = lines.pop();
		// What will their ID be ?
		aId = "link" + lineNumber;
		textId = "title" + lineNumber;
		tspanId = "textLine" + lineNumber;
		// What's the vertical position it should have ?
		textY = textYMin + (textYMax - textYMin) / (numberOfLines - 1) * (numberOfLines - lineNumber);
		// What's its color ?
		colorIndex = lineNumber % 3;
		// What's the content that goes here ?
		url = "?page=" + line;
		var title = undefined;
		if (titles != undefined) {
			title = titles[numberOfLines - lineNumber];
		};
		if (title == '' || title == undefined) {
			// maybe we can load it from the page data
			jQuery.ajax({url:'pages/'+line+'/title.txt',
			             dataType:'text',
			             success: function(response) { title = response; },
				         async: false
						});
		};
		// last resort : the title is the name of the page
		if (title == '' || title == undefined) {
			title = line;
		}

		className = "textBody line" + colorIndex;
		
		// Add the link (a) element
		link = svg.link($('#contents',root),url,{"id":aId, "class":className});
		// Construct the style for the text element

		text = svg.text(link,
		                0,
						textY,
						title,
						{"id": textId,
						 "class": className});
		lineNumber += 1;
	};
};