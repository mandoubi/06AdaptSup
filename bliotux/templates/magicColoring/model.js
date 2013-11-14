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
	color1: "black",
	color2: "white",
	color3: "red",
	color4: "blue"
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
    // Fill the images
	// first, the background (bitmap) image
	var imagePng = "pages/" + pageName + "/image.png";
	$('#imagePng',root).attr("xlink:href",imagePng);
	// then, the definition of fillable areas
	var imageSvg = "image.svg";
	insertSvgFile(
	    imageSvg,
		'#imageSvg',
		root
	);
	// Fill with colors
	jQuery.ajax({url:'pages/'+pageName+'/colors.txt',
             dataType:'text',
             success: function(response) {
			 		var reg=new RegExp("\n", "g");
					var colors = response.split(reg);
					$('#one',root).attr("fill",colors[0]);
					$('#two',root).attr("fill",colors[1]);
					$('#three',root).attr("fill",colors[2]);
					$('#four',root).attr("fill",colors[3]);
			 },
	         async: true
	});

};