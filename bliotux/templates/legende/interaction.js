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

var defaultStyle =
	"font-size:12px;" +
	"font-style:normal;" +
	"font-variant:normal;" +
	"font-weight:normal;" +
	"font-stretch:normal;" +
	"text-align:start;" +
	"line-height:125%;" +
	"writing-mode:lr-tb;" +
	"text-anchor:start;" +
	"fill:#000000;" +
	"fill-opacity:1;" +
	"stroke:none;" +
	"font-family:Frutiger Linotype;" +
	"-inkscape-font-specification:Frutiger Linotype";

var selectedStyle =
	"font-size:16px;" +
	"font-style:normal;" +
	"font-variant:normal;" +
	"font-weight:bold;" +
	"font-stretch:normal;" +
	"text-align:start;" +
	"line-height:125%;" +
	"writing-mode:lr-tb;" +
	"text-anchor:start;" +
	"fill:#FF0000;" +
	"fill-opacity:1;" +
	"stroke:none;" +
	"font-family:Frutiger Linotype;" +
	"-inkscape-font-specification:Frutiger Linotype";

/*
 * Will put all text elements in black.
 */
function resetLegend() {
	// set all legends elements as unselected
	$('#legend text', svg.root()).removeClass("selected");
	// set the color of all legend elements to black
	$('#legend text', svg.root()).attr("style",defaultStyle);
	// bind the clickOnLegend method to legend elements
	$('#legend text', svg.root()).attr("onclick","clickOnLegend(evt)");
}

function resetFigure() {
	// empty each text element in the figure
	$("#figure tspan",svg.root()).text("?????");
	// bind each of these elements to the proper function
	$("#figure tspan",svg.root()).attr("onclick","clickOnFigure(evt)");
};

/* Initialize the page
 * Called when the page is first displayed.
 */
function initPage() {
	resetLegend();
	resetFigure();
}

function clickOops(event) {
	// alert('clickOops: ' + event + event.target);
	initPage();
};

/*
 * When a legend text element is clicked.
 */
function clickOnLegend(event){
	//alert('clickOnLegend: ' + event + event.target);
	// all legend text elements back to black
	$("#legend text",svg.root()).attr("style", defaultStyle);
	// all legend text elements unselected
	$("#legend text",svg.root()).removeClass("selected");
	// where did we click ?
	var textElement = event.target;
	// select this element
	$("#" + textElement.id, svg.root()).addClass("selected");
	// show this element is selected
	$("#" + textElement.id, svg.root()).attr("style",selectedStyle);
}

/*
 * When some area in the figure is clicked.
 */
function clickOnFigure(evt) {
	var selected = $("#legend .selected", svg.root());
	var clicked = $("#" + evt.target.parentNode.id, svg.root());
	// copy selected text
	$("tspan",clicked).text(selected.text());
	// show its no more selected
	selected.attr("style",defaultStyle);
	// unselect selected text
	selected.removeClass("selected");
};


function clickReponse(event, reponse){
    //alert('clickReponse: ' + event + ', ' + reponse);
    var unite = $('.resultatUnite', svg.root());
    var dizaine = $('.resultatDizaine', svg.root());
    var centaine = $('.resultatCentaine', svg.root());
    if (unite.text() == "") {
        unite.html(reponse);
        storageSave('.resultatUnite', reponse);
    }
    else 
        if (dizaine.text() == "") {
            dizaine.html(reponse);
            storageSave('.resultatDizaine', reponse);
        }
        else 
            if (centaine.text() == "") {
                centaine.html(reponse);
                storageSave('.resultatCentaine', reponse);
            }
};