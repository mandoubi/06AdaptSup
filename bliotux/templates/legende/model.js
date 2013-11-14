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
	// The figure is defined as the file below
	'figureFileName': 'figure.svg',
	
	// The figure SVG will have its geometry modified according to:
	'figureTranslationHorizontal': 0,
	'figureTransationVertical': 100,
	'figureScalingWidth': 1,
	'figureScalingHeight': 1,
	'figureRotationAngle': 0,
	'figureRotationCenterX': 0,
	'figureRotationCenterY': 0
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
	
	// Fill the legende
	for (var i=0; i<21; i++) {
		textIndex = i+1;
		$('#texte'+textIndex,root).html("");
	};
	jQuery.ajax({url:'pages/'+pageName+'/legends.txt',
             dataType:'text',
             success: function(response) {
			 		var reg=new RegExp("\n", "g");
					var legends = response.split(reg);
					for (var i=0; i<legends.length; i++) {
						textIndex = i+1;
						$('#texte'+textIndex,root).html(legends[i]);
					};
			 },
	         async: true
	});

	// Fill the figure title
    jQuery.ajax({url:'pages/'+pageName+'/title.txt',
             	 dataType:'text',
             	 success: function(response) { title = response; },
	         	 async: false
	});
	$('tspan:contains(FigureTitle)',root).html(title);
	// Fill the figure itself
	insertSvgFile(
	    data['figureFileName'],
		'#figure',
		root
	);
	// Apply some geometry transformation to it
	var translation = "translate(" +
		data['figureTranslationHorizontal'] + "," +
		data['figureTransationVertical'] +
		")";
	var scaling = "scale(" +
		data['figureScalingWidth'] + "," +
		data['figureScalingHeight'] +
		")";
	var rotation = "rotate(" +
		data['figureRotationAngle'] + "," +
		data['figureRotationCenterX'] + "," +
		data['figureRotationCenterY'] +
		")";
	$('#figure',root).attr(
		"transform",
		translation + " " + scaling + " " + rotation);
};