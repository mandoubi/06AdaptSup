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
	// is the line of numbers visible
	'visibleNumbers': true

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
	
	// Prepare variables

	// 1st image, upper part
	var imageZone1Haut = "pages/" + pageName + "/imageZone1Haut";

	// 1st image, lower part
	var imageZone1Bas = "pages/" + pageName + "/imageZone1Bas";

	// 2nd image
	var imageZone2Haut  = "pages/" + pageName + "/imageZone2Haut";
	var imageZone2Bas  = "pages/" + pageName + "/imageZone2Bas";

	// 3rd image
	var imageZone3Haut = "pages/" + pageName + "/imageZone3Haut";
	var imageZone3Bas = "pages/" + pageName + "/imageZone3Bas";

	// 4th image
	var imageZone4Haut = "pages/" + pageName + "/imageZone4Haut";
	var imageZone4Bas = "pages/" + pageName + "/imageZone4Bas";

	// Images of the objects used for filling the zones
	var image11 = "pages/" + pageName + "/image11";
	var image12 = "pages/" + pageName + "/image12";
	var image13 = "pages/" + pageName + "/image13";
	var image14 = "pages/" + pageName + "/image14";
	var image15 = "pages/" + pageName + "/image15";
	var image21 = "pages/" + pageName + "/image21";
	var image22 = "pages/" + pageName + "/image22";
	var image23 = "pages/" + pageName + "/image23";
	var image24 = "pages/" + pageName + "/image24";
	var image25 = "pages/" + pageName + "/image25";
	var image31 = "pages/" + pageName + "/image31";
	var image32 = "pages/" + pageName + "/image32";
	var image33 = "pages/" + pageName + "/image33";
	var image34 = "pages/" + pageName + "/image34";
	var image35 = "pages/" + pageName + "/image35";
	
    // Fill the images
	$('#imageZone1Haut',root).attr("xlink:href",imageZone1Haut);
	$('#imageZone1Bas',root).attr("xlink:href",imageZone1Bas);
	$('#imageZone2Haut',root).attr("xlink:href",imageZone2Haut);
	$('#imageZone2Bas',root).attr("xlink:href",imageZone2Bas);
	$('#imageZone3Haut',root).attr("xlink:href",imageZone3Haut);
	$('#imageZone3Bas',root).attr("xlink:href",imageZone3Bas);
	$('#imageZone4Haut',root).attr("xlink:href",imageZone4Haut);
	$('#imageZone4Bas',root).attr("xlink:href",imageZone4Bas);

	$('.image1-1',root).attr("xlink:href",image11);
	$('.image1-2',root).attr("xlink:href",image12);
	$('.image1-3',root).attr("xlink:href",image13);
	$('.image1-4',root).attr("xlink:href",image14);
	$('.image1-5',root).attr("xlink:href",image15);
	$('.image2-1',root).attr("xlink:href",image21);
	$('.image2-2',root).attr("xlink:href",image22);
	$('.image2-3',root).attr("xlink:href",image23);
	$('.image2-4',root).attr("xlink:href",image24);
	$('.image2-5',root).attr("xlink:href",image25);
	$('.image3-1',root).attr("xlink:href",image31);
	$('.image3-2',root).attr("xlink:href",image32);
	$('.image3-3',root).attr("xlink:href",image33);
	$('.image3-4',root).attr("xlink:href",image34);
	$('.image3-5',root).attr("xlink:href",image35);

	// Hide/show some stuff
	if (data['visibleNumbers'] == true) {
		$('.chiffre',root).attr("style","font-size:40px;font-style:normal;font-weight:normal;fill:#000000;fill-opacity:1;stroke:none;font-family:Arial");
	} else {
		$('.chiffre',root).attr("style","font-size:40px;font-style:normal;font-weight:normal;fill:none;fill-opacity:1;stroke:none;font-family:Arial");
	}
	
};