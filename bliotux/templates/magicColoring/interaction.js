/* File: interaction.js
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
 * Prepares the image for magic coloring
 */
function initPage() {
	var pathes = document.getElementsByTagName("path");
	for (var i = 0; i < pathes.length; i++) {
		var path = pathes[i];
		// add copyColorFromPalette event handlers to the image
		path.setAttributeNS(
			null,
			"onclick",
			"copyColorFromPalette(evt)"
		);
		// define default style
		var style="fill:white;stroke:black;opacity:0";
		path.setAttributeNS(
			null,
			"style",
			style
		);
	}
}

/* 
 * Selects a color from the palette
 */
function selectColor(evt){
	var selectedColorElement = evt.target;
    var selection = document.getElementById("selection");
	// fill with selected color
    selection.setAttributeNS(
		null,
		"fill",
		selectedColorElement.getAttributeNS(null,"fill")
	);
}

/* 
 * Fills the target zone with selected color
 */
function copyColorFromPalette(evt){
	var target = evt.target;
	var color = document.getElementById("selection").getAttributeNS(null,"fill");
	target.setAttributeNS(null,"fill",color);
	var style="fill:" + color + ";stroke:none;opacity:0.8";
	target.setAttributeNS(null,"style",style);
};