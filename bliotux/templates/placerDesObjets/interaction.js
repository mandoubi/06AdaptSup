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

/* Initialize the page
 * Called when the page is first displayed.
 */
function initPage() {
	// make objects draggable
	$('.objet', svg.root()).attr("onclick","toggle_dragging(evt)");
	
	// make zones ready for objects drops
	$('.dropZone', svg.root()).attr("onclick","drop_object(evt)");

	// move objects to their saved location
	/*
	$('.object', svg.root()).attr('x', storageLoad('x#' + dragging));
	$('.object', svg.root()).attr('y', storageLoad('x#' + dragging));
	*/
	
}

function clickOops(event) {
	// alert('clickOops: ' + event + event.target);
	window.location.reload();
	//initPage();
	
	//FIXME : should fully reload the page
	//FIXME : initPage should be triggered at document load, shouldn't it ?
};

var dragging = null;
var offsetx = null;
var offsety = null;
var clickedAt = null;

function attribute(id, attr, newValue) {
    var elt = $('#'+id, svg.root());
    var existingValue = elt.attr(attr);
    if (existingValue != "") { // usual case
        if (newValue == undefined) { // getter
            return existingValue;
        } else { // setter
            elt.attr(attr, newValue);
        }
    } else { // the attribute may have an animated value hiding a static one
        if (newValue == undefined) { // getter
            return elt[0].attributes[attr].value;
        } else { // setter
            elt[0].attributes[attr].value = newValue;
        }
    };
};

function now_drag(evt){
	if (dragging != null) {
		// $('#' + dragging, svg.root()).attr('x', evt.layerX - offsetx);
                attribute(dragging,'x',evt.layerX - offsetx);
                attribute(dragging,'y',evt.layerY - offsety);
		//$('#' + dragging, svg.root()).attr('y', evt.layerY - offsety);
	}
}

function drop_object(evt) {
	if (dragging != null) {
		
		// one final move before we actually drop it
		attribute(dragging,'x', evt.layerX - offsetx);
                //$('#' + dragging, svg.root()).attr('x', evt.layerX - offsetx);
		attribute(dragging, 'y', evt.layerY - offsety);
                //$('#' + dragging, svg.root()).attr('y', evt.layerY - offsety);
		
		// save position of the target
		storageSave('x#' + dragging, attribute(dragging,'x'));
		storageSave('y#' + dragging, attribute(dragging,'y'));

		dragging = null;
	}
}

function toggle_dragging(evt){
    var target = evt.target;
	if (dragging == null) {
		// not dragging anything yet, so drag this object
		dragging = target.id;
	    //offsetx = evt.layerX - $('#' + target.id, svg.root()).attr('x');
            offsetx = evt.layerX - attribute(target.id, 'x');
            //offsety = evt.layerY - $('#' + target.id, svg.root()).attr('y');a
            offsety = evt.layerY - attribute(target.id, 'y');
	} else if (dragging == target.id) {
		// currently dragging this object, so drop it
		drop_object(evt);
	}
};
