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
	// Page number as shown on paper textbook
	'numero-de-page': '1',
	
	// Exercice number as shown on paper textbook
	'numero-dexercice': '1',
	
	// Instructions label of the exercice
	'enonce': 'Calcule',
	
	// Parts of the mathematical operation
	'operande1': '0',
	'operateur': '+',
	'operande2': '0',
	
	// Result (as shown by default)
	'resultat': '',
	
	// If there is an SVG illustration, then its file should be
	// stored in the page folder and should be named illustration.svg
	// If there is a JPEG, GIF, PNG (or other bitmap-base format)
	// illustration, then it should be stored in the page folder and
	// it should be named bitmapIllustration (without any file extension).
	
	// The illustration will have its geometry modified :
	'illustrationTranslationHorizontal': 0,
	'illustrationTransationVertical': 0,
	'illustrationScalingWidth': 1,
	'illustrationScalingHeight': 1,
	'illustrationRotationAngle': 0,
	'illustrationRotationCenterX': 0,
	'illustrationRotationCenterY': 0
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
	
	// Split hundreds, tens and units
	
	var pageUnite = data['numero-de-page'].slice(-1);
	var pageDizaine = data['numero-de-page'].slice(-2,-1);
	var pageCentaine = data['numero-de-page'].slice(-3,-2);
	
	var exerciceUnite = data['numero-dexercice'].slice(-1);
	var exerciceDizaine = data['numero-dexercice'].slice(-2,-1);
	var exerciceCentaine = data['numero-dexercice'].slice(-3,-2);
	
	var operande1Unite = data['operande1'].slice(-1);
	var operande1Dizaine = data['operande1'].slice(-2,-1);
	var operande1Centaine = data['operande1'].slice(-3,-2);
	
	var operande2Unite = data['operande2'].slice(-1);
	var operande2Dizaine = data['operande2'].slice(-2,-1);
	var operande2Centaine = data['operande2'].slice(-3,-2);
	
	var resultatUnite = data['resultat'].slice(-1);
	var resultatDizaine = data['resultat'].slice(-2,-1);
	var resultatCentaine = data['resultat'].slice(-3,-2);
	
	// Fill the template
	$('.enonce',root).text(data['enonce']);
	$('.pageCentaine',root).text(pageCentaine);
	$('.pageDizaine',root).text(pageDizaine);
	$('.pageUnite',root).text(pageUnite);
	$('.exerciceCentaine',root).text(exerciceCentaine);
	$('.exerciceDizaine',root).text(exerciceDizaine);
	$('.exerciceUnite',root).text(exerciceUnite);
	$('.operande1Centaine',root).text(operande1Centaine);
	$('.operande1Dizaine',root).text(operande1Dizaine);
	$('.operande1Unite',root).text(operande1Unite);
	$('.operateur',root).text(data['operateur']);
	$('.operande2Centaine',root).text(operande2Centaine);
	$('.operande2Dizaine',root).text(operande2Dizaine);
	$('.operande2Unite',root).text(operande2Unite);
	$('.resultatCentaine',root).text(resultatCentaine);
	$('.resultatDizaine',root).text(resultatDizaine);
	$('.resultatUnite',root).text(resultatUnite);
	
	// Fill the SVG illustration itself if needed
	insertSvgFile('illustration.svg', '#illustration', root);
	
	// Fill the bitmap illustration itself if needed
	$('#bitmapIllustration',root).attr(
		"xlink:href",
		"pages/" + pageName + "/bitmapIllustration");
	
	
	// If there is to be a bitmap-file illustration, it should be
	// named bitmapIllustration (no file extension) and should be place
	// into the page folder.
	
	// Apply some geometry transformation to it
	var translation = "translate(" +
		data['illustrationTranslationHorizontal'] + "," +
		data['illustrationTransationVertical'] +
		")";
	var scaling = "scale(" +
		data['illustrationScalingWidth'] + "," +
		data['illustrationScalingHeight'] +
		")";
	var rotation = "rotate(" +
		data['illustrationRotationAngle'] + "," +
		data['illustrationRotationCenterX'] + "," +
		data['illustrationRotationCenterY'] +
		")";
	$('.illustration',root).attr(
		"transform",
		translation + " " + scaling + " " + rotation);
};