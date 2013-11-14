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

var windowHeight = $(window).height();
var windowWidth = $(window).width();
var view;

/*var prefix = "slicedExample#sliced#box_parentPageURL-";
for (var key in localStorage) {
	if (key.substring(0,prefix.length) == prefix) {
		localStorage.removeItem(key);
	};
};
*/

function localSave(key,value) {
	localStorage.setItem(pageName + "#" + template + "#" + key, JSON.stringify(value));
};


function localLoad(key) {
	var item = localStorage.getItem(pageName + "#" + template + "#" + key);
	try {
		return JSON.parse(item)
	} catch (e) {
		// ignore parsing error
	};
};


function initPage() {
	view = new View();
};



function view_toggleMode(event) {
	view.toggleMode();
};

function view_displayParentBox(event) {
	view.displayParentBox();
};

function view_displayNextBox(event) {
	view.displayNextBox();
};

function view_displayClickedBox(event) {
	if ( event.detail > 1 ) {
		// double click
		view.displayClickedBox(event);
	};
};

function guideToggle(event) {
	view.guideToggle(event);
};

function draggedGuide_draw(event) {
	view.drawDraggedGuide();
};

function draggedGuide_drag(event) {
	view.dragGuides(event);
};


function textButton_click(event) {
	view.handleText();
};


function textArea_change(event) {
	view.box.text=$("#textArea",svg.root()).val();
	view.box.saveProperties();
};


function Guide(box, isHorizontal, coordInPage, cssClass) {
	this.box = box;
	this.isHorizontal = isHorizontal;
	
	// This coordinate refers to the original page, not to the web browser.
	this.coordInPage = coordInPage;
	
	this.cssClass = cssClass;
};


Guide.prototype.name = function() {
	if (this.isHorizontal == true) {
		return "y" + this.coordInPage;
	} else {
		return "x" + this.coordInPage;		
	};
};


function Page(someView) {
	this.view = someView;
	// now load values from storage if available
	var pageAsDataURL = localLoad('image');
	if (pageAsDataURL != undefined) {
		$("#image",svg.root()).attr("xlink:href", pageAsDataURL);
	};
	// or from the default view
	this.url = $("#image",svg.root()).attr("xlink:href");
	this.measureThenResize();
};


Page.prototype.measureThenResize = function() {
	/* Loads the image of the page so that its width and height can be
	 * measured and the view reloaded accordingly.
	 */
	var thisPage = this;
	var img = new Image();
	img.onload = function() {
		thisPage.width = this.width;
		thisPage.height = this.height;
		if (thisPage.view.box.width == undefined) {
			thisPage.view.box.width = this.width;
			thisPage.view.box.height = this.height;
		};
		thisPage.view.reload();
	};
	img.src = this.url;
};


Page.prototype.saveAndReload = function() {
	/* Saves the page and reloads the window */
	localSave('image', this.url);
	window.location.reload();
};


Page.prototype.setFromImageFile = function(file) {
	/* Sets image read from file
	 * 	file : image file
	 */
	var thisPage = this;
	var reader = new FileReader();
	reader.onload = function (event) {
		thisPage.url = event.target.result;
		$("#image",svg.root()).attr("xlink:href",thisPage.url);
		thisPage.measureThenResize();
		thisPage.saveAndReload();
	};
	reader.readAsDataURL(file);
};


Page.prototype.setFromPDFFile = function(file) {
	/* Sets image read from 1st page of file
	 * 	file : PDF file
	 */
	var thisPage = this;
	var reader = new FileReader();
	reader.onload = function (event) {
		/* Once the file is read, interpret its contents */
		var pdfData = event.target.result;
		var pdfUint8Array = new Uint8Array(pdfData);
		// once appropriately converted, render into canvas
		PDFJS.workerSrc = "/js/pdf.js";
		PDFJS.getDocument(pdfUint8Array).then(
				function getDocumentCallback(pdfDoc) {
					//
					// Instantiate PDFDoc with PDF data
					//
					pdfDoc.getPage(1).then(function getPdfPage(pdfPage) {
						var pdfScale = 2;
						var pdfViewport = pdfPage.getViewport(pdfScale);
						//
						// Prepare canvas using PDF page dimensions
						//
						var pdfCanvas = document.createElement("canvas");
						var pdfContext = pdfCanvas.getContext('2d');
						pdfCanvas.height = pdfViewport.height;
						pdfCanvas.width = pdfViewport.width;
						//
						// Render PDF page into canvas context
						//
						pdfPage.render(
							{canvasContext: pdfContext,
							viewport: pdfViewport})
							.then(function() {
								thisPage.url = pdfCanvas.toDataURL();
								$("#image",svg.root()).attr("xlink:href",
										thisPage.url);
								thisPage.measureThenResize();
								thisPage.saveAndReload();			        		
							});
					});
				},
				function getDocumentError(message, exception) {
					alert(message, exception);
				},
				function getDocumentProgress(progressData) {
					alert(progressData);
				}
		);
	};
	// read that file
	reader.readAsArrayBuffer(file);
};


function Box(someView, page, x, y, w, h, parentBox) {

	this.view = someView;

	// A box is defined by its page, offset and size.
	
	if (page == undefined) {
		this.page = new Page(this.view);
	} else {
		this.page = page; 
	};
	// Box dimensions refer to the dimensions of the original image of the page
	// and not to the image as rendered in the web browser.
	if (x != undefined) {
		this.x = x;
	} else {
		this.x = 0;		
	};
	if (y != undefined) {
		this.y = y;
	} else {
		this.y = 0;		
	};
	if (w != undefined) {
		this.width = w;
	} else {
		this.width = this.page.width;		
	};
	if (h != undefined) {
		this.height = h;
	} else {
		this.height = this.page.height;		
	};

	// and it has guides, parent settings and text which might be loaded from
	// local storage...
	this.loadProperties();

	// or parents settings are set (and overridden) via given parentBox parameter
	if (parentBox != undefined) {
		this.parentBox = parentBox;
		this.parentX = parentBox.x;
		this.parentY = parentBox.y;
		this.parentWidth = parentBox.width;
		this.parentHeight = parentBox.height;
		this.saveProperties();
	};
};


Box.prototype.digest = function() {
	/*
	 * Returns a hash of the box based on its page URL, horizontal offset,
	 * vertical offset, width and height.
	 * 
	 */
	var digestKey = "x = " + this.x
		+ " / y = " + this.y
		+ " / width = " + this.width
		+ " / height = " + this.height
		+ " / page URL = " + this.page.url;
	if (this.cachedDigestKey == digestKey) {
		// we already have the digest for this box 
		return this.cachedDigest;
	} else {
		// let's calculate the digest for this box
		this.cachedDigestKey = digestKey;
		this.cachedDigest = sha256_digest(digestKey);
		return this.cachedDigest;
	};
};


Box.prototype.saveProperties = function() {
	/*
	 * Saves box guides, text and parent box.
	 */
	var hg = {};
	var vg = {};
	for (var i = 0; i < this.guides.length; i++) {
		var guide = this.guides[i];
		if (guide.isHorizontal == true) {
			hg[guide.coordInPage] = guide.name();
		} else {
			vg[guide.coordInPage] = guide.name();
		};
	};
	localSave("box_horizontalGuides-"+this.digest(), hg);
	localSave("box_verticalGuides-"+this.digest(), vg);
	localSave("box_parentX-"+this.digest(), this.parentX);
	localSave("box_parentY-"+this.digest(), this.parentY);
	localSave("box_parentWidth-"+this.digest(), this.parentWidth);
	localSave("box_parentHeight-"+this.digest(), this.parentHeight);
	localSave("box_text-"+this.digest(), this.text);
};


Box.prototype.loadProperties = function() {
	/*
	 * Loads all box properties unless the box is not defined.
	 */
	if (this.width == undefined
		|| this.height == undefined
		|| this.x == undefined
		|| this.y == undefined
		|| this.page.url == undefined
		|| this.page.url == "") {
		return;
	};

	// document.title += "/load" + this.digest()[10] + this.digest()[11];
	this.parentX = localLoad("box_parentX-"+this.digest());
	this.parentY = localLoad("box_parentY-"+this.digest());
	this.parentWidth = localLoad("box_parentWidth-"+this.digest());
	this.parentHeight = localLoad("box_parentHeight-"+this.digest());

	// now load guides
	var hGuides = localLoad('box_horizontalGuides-'+this.digest());
	var vGuides = localLoad('box_verticalGuides-'+this.digest());

	// remove previous guides (those from previous image)
	this.guides = new Array();
	if (hGuides != undefined) {
		for (var coordInPage in hGuides) {
			this.addGuide(true, coordInPage);
		};
	};
	if (vGuides != undefined) {
		for (var coordInPage in vGuides) {
			this.addGuide(false, coordInPage);
		};
	};
	// document.title += "/guides" + this.guides.length;
	this.text = localLoad("box_text-"+this.digest());
};


Box.prototype.sortedGuideCoords = function(horizontal) {
	/* 
	 * Returns the coordinates of guides of the given orientation
	 * sorted by coordinate and starting with the coordinate of the box.
	 * 
	 * horizontal : true if and only if we are interested in horizontal guides
	 * 
	 */
	var coords;
	if ( horizontal == true ) {
		coords = [this.y];
	} else {
		coords = [this.x];
	};
	for (var i = 0; i < this.guides.length; i++) {
		var guide = this.guides[i];
		if (guide.isHorizontal == horizontal) {
			coords.push(guide.coordInPage * 1);
		};
	};
	coords.sort(function(a,b){return a-b});
	return coords;
};


Box.prototype.loadFirstChild = function() {
	return this.loadNextAt(this,
		-1,
		-1);
};


Box.prototype.loadNextSibling = function() {
	return this.loadNextAt(this.parentBox,
		this.x,
		this.y);
};


Box.prototype.loadParent = function() {
	if (this.parentBox == undefined) {
		this.parentBox = new Box(this.view,
			this.page,
			this.box.parentX,
			this.box.parentY,
			this.box.parentWidth,
			this.box.parentHeight
		);
	};
	return this.parentBox;
};


Box.prototype.loadNextAt = function(parentBox, x, y) {
	/*
	 * Returns next box by calculating its geometry at given point.
	 * 
	 * parentBox : parentBox of the current box
	 * x : horizontal offset of the current box
	 * y : vertical offset of the current box
	 * 
	 */
	
	// At which offsets does next box start ?
	var vGuides = parentBox.sortedGuideCoords(false);
	var hGuides = parentBox.sortedGuideCoords(true);

	var nextX = x;
	var nextY = y;
	if (x < 0 || y < 0) {
		nextX = parentBox.x;
		nextY = parentBox.y;
	} else {
		var hIndex = vGuides.indexOf(x);
		if (hIndex + 1 == vGuides.length) {
			nextX = parentBox.x; // 1st column
			var vIndex = hGuides.indexOf(y);
			if (vIndex + 1 == hGuides.length) {
				nextY = parentBox.y; // 1st row
			} else { // next row
				nextY = hGuides[vIndex + 1] * 1;
			};
		} else { // next column, same row
			nextX = vGuides[hIndex + 1] * 1;
		};
	};

	// What's the horizontal size of next box (in the page) ?
	var nextWidth;
	var nhIndex = vGuides.indexOf(nextX);
	if (nhIndex + 1 == vGuides.length) {
		// last column
		nextWidth = (parentBox.width + parentBox.x) - nextX;
	} else {
		nextWidth = vGuides[nhIndex + 1] - nextX;
	};

	// What's the vertical size of next box (in the page) ?
	var nextHeight;
	var nvIndex = hGuides.indexOf(nextY);
	if (nvIndex + 1 == hGuides.length) {
		// last row
		nextHeight = (parentBox.height + parentBox.y) - nextY;
	} else {
		nextHeight = hGuides[nvIndex + 1] - nextY;
	};

	var nextBox = new Box(this.view,
		this.page,
		nextX,
		nextY,
		nextWidth,
		nextHeight,
		parentBox);
	return nextBox;
};


Box.prototype.addGuide = function(horizontal, coordInPage) {
	/* 
	 * Creates a guide with given parameters.
	 * 
	 * 		horizontal : true if and only if the guide is horizontal
	 * 		coordInPage : x or y coordinate referring to the original image of
	 * the page.
	 * 
	 */
	var guide = new Guide(this, horizontal, coordInPage);
	// store that
	this.guides.push(guide);
	return guide;
};


Box.prototype.removeGuide = function(guide) {
	/* Removes given guide from the box */
	
	var index = this.guides.indexOf(guide);
	if (index > -1) {
		this.guides.splice(index,1);
	};
};


Box.prototype.searchGuides = function(horizontal, coordInPage) {
	/*
	 * Returns the searched guide with given orientation 
	 * and given coordinate in page if it exists. Returns undefined otherwise.
	 * 
	 * 		horizontal : orientation sought
	 * 		coordInPage : given coordinate in page
	 * 
	 */
	var step = 10;
	var guides = new Array();
	for (var i = 0; i < this.guides.length; i++) {
		var guide = this.guides[i];
		if (guide.isHorizontal == horizontal
			&& Math.abs(guide.coordInPage - coordInPage) <= step) {
			guides.push(guide);
		};
	};
	return guides;
};


function Viewport(someView) {
	this.view = someView;
	
	// This is the ratio between the size of the original page and the
	// size as it is rendered in this viewport.
	this.baseScale = 1;
	this.svgScale = 1;
	this.svgVerticalTranslationInBrowser = 0;
	this.svgHorizontalTranslationInBrowser = 0;

	// These are the dimensions as rendered in the web browser
	this.width = this.view.width;
	this.height = this.view.height;
};


Viewport.prototype.hasMouseInAt = function(x,y) {
	/* Returns true if and only if given coordinates are in view port.
		Returns false otherwise

		x,y : given coordinates	*/

	return (0 <= x && x <= this.width && 0 <= y && y <= this.height);
};


Viewport.prototype.isCloserToVerticalEdgeOfBoxAt = function(someBox,xInViewport,yInViewport) {

	/* Returns true if given coordinates are closer to a vertical edge
	than to an horizontal edge for the given box. Returns false otherwise.

		someBox : the box with edges being considered
		x : horizontal coordinate
		y : vertical coordinate	*/

	var boxTop = this.convertPageToViewportCoord(someBox.y);
	var boxBottom = boxTop + this.convertPageToViewportCoord(someBox.height);
	var boxLeft = this.convertPageToViewportCoord(someBox.x);
	var boxRight = boxLeft + this.convertPageToViewportCoord(someBox.width);
	var distFromTop = Math.abs(boxTop - yInViewport);
	var distFromBottom = Math.abs(boxBottom - yInViewport);
	var distFromLeft = Math.abs(boxLeft - xInViewport);
	var distFromRight = Math.abs(boxRight - xInViewport);
	var distFromNearestHorizontalEdge = Math.min(distFromBottom, distFromTop);
	var distFromNearestVerticalEdge = Math.min(distFromLeft, distFromRight);

	return distFromNearestVerticalEdge < distFromNearestHorizontalEdge;
};


Viewport.prototype.resize = function() {
	/* Resizes SVG view port so it fits the image in the box of the view. */

	var pageLeft = 0;
	var pageTop = 0;
	var pageWidth = this.view.box.width; // page.width;
	var pageHeight = this.view.box.height; // page.height;
	this.width = windowWidth;
	pageLeft = 0;
	this.baseScale = windowWidth / pageWidth;
	this.height = Math.round(pageHeight * this.baseScale);
	pageTop = (windowHeight - this.height) / 2;

	// resize SVG root
	$(svg.root()).attr("height", this.height);
	$(svg.root()).attr("width", this.width);

	// resize the image of the page
	$("#image",svg.root()).attr("height", this.height);
	$("#image",svg.root()).attr("width", this.width);
	$("#image", svg.root()).attr("transform",
			"translate(-" + pageLeft + " -" + pageTop + ")");

	// resize toolbar
	var toolbarXTranslation = -600 + windowWidth;
	$("#toolbar",svg.root()).attr("transform", "translate("+ toolbarXTranslation+" 0)");
	$("#showToolbar",svg.root()).attr("from", toolbarXTranslation);
	$("#showToolbar",svg.root()).attr("to", toolbarXTranslation - 150);
	$("#hideToolbar",svg.root()).attr("from", toolbarXTranslation - 150);
	$("#hideToolbar",svg.root()).attr("to", toolbarXTranslation);

	// resize guides
	$(".guideGroup line[x1=0]",svg.root()).attr("x2",this.width);
	$(".guideGroup line[y1=0]",svg.root()).attr("y2",this.height);
};


Viewport.prototype.convertPageToViewportCoord = function (coordInPage) {
	/* Given a coordinate which refers to the original page, it returns
	 * the rounded equivalent coordinate referring to the viewport.
	 * 
	 * Explanation :
	 * 
	 * 		coordInPage => coordInViewport => coordInBrowser
	 * 
	 */

	return Math.round(coordInPage * this.baseScale);
};


Viewport.prototype.convertPageToBrowserCoord = function (coordInPage, horizontal) {
	/* Given a coordinate which refers to the original page, it returns
	 * the rounded equivalent coordinate referring to the browser.
	 * 
	 * Explanation :
	 * 
	 * 		coordInPage => coordInViewport => coordInBrowser
	 * 
	 */

	var offset;
	if (horizontal == true) {
		offset = this.svgHorizontalTranslationInBrowser;
	} else {
		offset = this.svgVerticalTranslationInBrowser;
	};
	return Math.round((coordInPage * this.baseScale + offset) * this.svgScale);
};


Viewport.prototype.convertBrowserToViewportCoord = function (coordInBrowser, horizontalCoord) {
	/* Given a coordinate which refers to the browser, it returns
	 * the rounded equivalent coordinate referring to the viewport.
	 * 
	 * Explanation :
	 * 
	 * 		coordInPage => coordInViewport => coordInBrowser
	 * 
	 */

	var offset;
	if (horizontalCoord == true) {
		offset = this.svgHorizontalTranslationInBrowser;
	} else {
		offset = this.svgVerticalTranslationInBrowser;
	};
	return Math.round(coordInBrowser / this.svgScale - offset);
};


Viewport.prototype.convertBrowserToPageCoord = function (coordInBrowser, horizontal) {
	/* Given a coordinate which refers to the browser, it returns
	 * the rounded equivalent coordinate referring to the original page.
	 * 
	 * Explanation :
	 * 
	 * 		coordInPage => coordInViewport => coordInBrowser
	 * 
	 */

	var offset;
	if (horizontal == true) {
		offset = this.svgHorizontalTranslationInBrowser;
	} else {
		offset = this.svgVerticalTranslationInBrowser;
	};
	return Math.round((coordInBrowser / this.svgScale - offset) / this.baseScale);
};


Viewport.prototype.convertViewportToBrowserCoord = function (coordInViewport, horizontal) {
	/* Given a coordinate which refers to the viewport, it returns
	 * the rounded equivalent coordinate referring to the browser.
	 * 
	 * Explanation :
	 * 
	 * 		coordInPage => coordInViewport => coordInBrowser
	 * 
	 */

	var offset;
	if (horizontal == true) {
		offset = this.svgHorizontalTranslationInBrowser;
	} else {
		offset = this.svgVerticalTranslationInBrowser;
	};
	return Math.round((coordInViewport + offset) * this.svgScale);
};


Viewport.prototype.convertViewportToPageCoord = function (coordInViewport) {
	/* Given a coordinate which refers to the viewport, it returns
	 * the rounded equivalent coordinate referring to the original page.
	 * 
	 * Explanation :
	 * 
	 * 		coordInPage => coordInViewport => coordInBrowser
	 * 
	 */

	return Math.round(coordInViewport / this.baseScale);
};


function View() {
	this.editMode = false;
	this.height = windowHeight;
	this.width = windowWidth;
	this.textAreaVisibility = "hidden";
	this.viewport = new Viewport(this);
	this.box = new Box(this);
	this.activate();
};



View.prototype.drawDraggedGuide = function() {
	/* Draws (or redraws) a dragged guide if there's none	*/

	if ($(".draggedGuide", svg.root()).length == 0 && this.editMode == true) {
		// draw a guide out of the viewport and make it draggable
		var draggedGuide = new Guide(
			undefined,
			true,
			this.viewport.convertBrowserToPageCoord(-100, false),
			"draggedGuide");
		this.drawGuide(draggedGuide);
		$(svg.root()).attr("onmousemove","draggedGuide_drag(evt)");
	};
};


View.prototype.removeDraggedGuides = function() {
	/* Removes dragged guide	*/
	$(".draggedGuide",svg.root()).remove();
};


View.prototype.dragGuides = function(event){
	var xInBrowser = event.layerX;
	var yInBrowser = event.layerY;
	var xInViewport = this.viewport.convertBrowserToViewportCoord(xInBrowser, true);
	var yInViewport = this.viewport.convertBrowserToViewportCoord(yInBrowser, false);
	if (this.viewport.hasMouseInAt(xInViewport,yInViewport) == true) {
		if (this.viewport.isCloserToVerticalEdgeOfBoxAt(this.box,xInViewport,yInViewport) == true) {
			// horizontal guide
			$(".draggedGuide",svg.root()).attr("x1",0);
			$(".draggedGuide",svg.root()).attr("y1",yInViewport);
			$(".draggedGuide",svg.root()).attr("x2",this.viewport.width);
			$(".draggedGuide",svg.root()).attr("y2",yInViewport);
		} else {
			// vertical guide
			$(".draggedGuide",svg.root()).attr("x1",xInViewport);
			$(".draggedGuide",svg.root()).attr("y1",0);
			$(".draggedGuide",svg.root()).attr("x2",xInViewport);
			$(".draggedGuide",svg.root()).attr("y2",this.viewport.height);
		};
	} else {
		$(".draggedGuide", svg.root()).remove();
	};
};


View.prototype.guideToggle = function(event){

	/* Sets or unsets a slicing guide at mouse click

		event : mouse click	*/

	if (event.originalTarget == $("toolbar")[0]) {
		return; // This was a click on the toolbar. No guide then.
	};
	if (this.editMode == true) {

		var xInBrowser = event.layerX;
		var yInBrowser = event.layerY;
		var xInViewport = this.viewport.convertBrowserToViewportCoord(xInBrowser, true);
		var yInViewport = this.viewport.convertBrowserToViewportCoord(yInBrowser, false);
		if (this.viewport.hasMouseInAt(xInViewport, yInViewport) == false) {
			return; // mouse out of view port
		};

		// identify guide
		var isHorizontal = this.viewport.isCloserToVerticalEdgeOfBoxAt(this.box,xInViewport, yInViewport);
		var coordInBrowser;
		if (isHorizontal == false) {
			coordInBrowser = xInBrowser;
		} else {
			coordInBrowser = yInBrowser;			
		};
		var coordInPage = this.viewport.convertBrowserToPageCoord(coordInBrowser, !isHorizontal);
		var guides = this.box.searchGuides(isHorizontal,coordInPage);

		// do we have guides there ?
		if (guides.length > 0) {
			// there already are guides there
			// let's remove them
			for (var i = 0; i < guides.length; i++) {
				var guide = guides[i];
				this.box.removeGuide(guide);
				$("#" + guide.name(),svg.root()).remove();
				// FIXME : the reload below is a work around for the following
				// bug => 1/ load one image file 2/ load another one 3/ click on
				// a guide to remove it 4/ see it's not removed unless you
				// reload the page.
				// window.location.reload();
			};
			this.box.saveProperties();
		} else {
			// let's draw it
			var guide = this.box.addGuide(isHorizontal, coordInPage);
			this.box.saveProperties();
			this.drawGuide(guide);
		};
	};
};


View.prototype.activate = function() {

	// activate the toggle button
	$('#button', svg.root()).attr("onclick", "view_toggleMode(evt);");

	// activate the up arrow
	$('#arrowUp', svg.root()).attr("onclick", "view_displayParentBox(evt);");

	// activate the right arrow
	$('#arrowRight', svg.root()).attr("onclick", "view_displayNextBox(evt);");

	// make it sliceable
	$('#layer1', svg.root()).attr("onclick","guideToggle(evt);");

	// draw the dragged guide whenever the mouse enters
	$("#layer1",svg.root()).attr("onmouseover","draggedGuide_draw(evt);");

	// activate the text button and its text area
	$('#textButton', svg.root()).attr("onclick","textButton_click(evt);");
	$('#textArea', svg.root()).attr("oninput","textArea_change(evt);")
	$('#textArea', svg.root()).attr("onpropertychange","textArea_change(evt);")
	$('#textArea', svg.root()).bind('onkeyup',"textArea_change(evt);");
	$('#textArea', svg.root()).bind('onpaste',"textArea_change(evt);");
	$('#textArea', svg.root()).bind('oncut',"textArea_change(evt);");

	var thisView = this;

	try {
		$('#fileLoad',svg.root()).change(function() {
			// detect file format from file extension
			var fileName = this.value;
			var dotPos = fileName.lastIndexOf(".")+1;
			var fileExt = fileName.substr(dotPos);
			if (fileExt == "jpg" ||
				fileExt == "jpeg" ||
				fileExt == "gif" ||
				fileExt == "png") {
				thisView.box.page.setFromImageFile(this.files[0]);
			} else if (fileExt == "pdf") {
				thisView.box.page.setFromPDFFile(this.files[0]);
			} else {
				alert("Les fichiers en '." + fileExt +"' ne sont pas supportés.");
			};
			// set back to slicing mode
			if (thisView.editMode == false) {
				thisView.toggleMode();
			};
		});
	} catch (e) {
		alert(e);
	};
};


View.prototype.showGuides = function() {
	for (var i = 0; i < this.box.guides.length; i++) {
		var guide = this.box.guides[i];
		this.drawGuide(guide);
	};
};


View.prototype.hideGuides = function() {
	$(".guideGroup",svg.root()).remove();
};

View.prototype.updateGuides = function() {
	/* Show or hide guides according to current edit mode */
	if (this.editMode == true) {
		this.hideGuides();
		this.showGuides();
		this.drawDraggedGuide();
	} else {
		this.hideGuides();
		this.removeDraggedGuide();
	};
};


View.prototype.hideBoxHiders = function() {
	$(".boxHider", svg.root()).remove();
};


View.prototype.showBoxHiders = function() {
	/* show box hiders. */

	var svgGroup = $('#layer1', svg.root());
	var vGuides = this.box.sortedGuideCoords(false);
	vGuides.push(this.box.x + this.box.width);
	var hGuides = this.box.sortedGuideCoords(true);
	hGuides.push(this.box.y + this.box.height);
	if ( hGuides.length > 2 || vGuides.length > 2 ) {
		// there are guides in the current box
		for ( var i = 0; i < hGuides.length - 1; i++) {
			for ( var j = 0; j < vGuides.length - 1; j++) {
				var x = this.viewport.convertPageToViewportCoord(vGuides[j]);
				var y = this.viewport.convertPageToViewportCoord(hGuides[i]);
				var width = this.viewport.convertPageToViewportCoord(vGuides[j+1] - vGuides[j]);
				var height = this.viewport.convertPageToViewportCoord(hGuides[i+1] - hGuides[i]);
				svg.rect(svgGroup, x, y, width, height, 0, 0,
					{ class : 'boxHider',
					onclick: "view_displayClickedBox(evt);"	});
			};
		};
	};
};


View.prototype.updateBoxHiders = function() {
	/* Show or hide guides according to current edit mode */
	if (this.editMode == false) {
		this.hideBoxHiders();
		this.showBoxHiders();
	} else {
		this.hideBoxHiders();
	};
};


View.prototype.toggleMode = function(){

	/* Sets view/edit mode.	*/

	if (this.editMode == false) {
		// switch to edit mode
		this.editMode = true;
	} else {
		// switch to view mode
		this.editMode = false;
	};
	// show or hide guides and box hiders accordingly
	this.updateGuides();
	this.updateBoxHiders();
};


View.prototype.removeDraggedGuide = function() {
	if (this.draggedGuide != undefined) {
		this.draggedGuide.remove();
	};
};


View.prototype.createClipPath = function(someBox) {
	/* Create clip path covering the given box
	 * 
	 * someBox : given box
	 * 
	 */
	// Create a clippath
	var clipPath = svg.clipPath($("#layer1",svg.root())[0], "boxClipper");
	// Add to the clip path a rectangle the size of the box in the browser
	var boxXInViewport = this.viewport.convertPageToViewportCoord(someBox.x); 
	var boxYInViewport = this.viewport.convertPageToViewportCoord(someBox.y); 
	var boxWidthInViewport = this.viewport.convertPageToViewportCoord(someBox.width); 
	var boxHeightInViewport = this.viewport.convertPageToViewportCoord(someBox.height); 
	svg.rect(clipPath,
		boxXInViewport,
		boxYInViewport,
		boxWidthInViewport,
		boxHeightInViewport);
	// apply opacity out of slice
	$("#layer1",svg.root()).attr("clip-path","url(#boxClipper)");	
};


View.prototype.removeClipPaths = function() {
	/* Removes clip paths from SVG	*/

	$("#layer1 clipPath",svg.root()).remove();	
	$("#layer1",svg.root()).removeAttr("clip-path");
};


View.prototype.saveTextIfVisible = function() {
	if (this.textAreaVisibility == "visible") {
		this.box.text=$("#textArea",svg.root()).val();
		this.box.saveProperties();
	};
};

View.prototype.displayParentBox = function() {
	this.saveTextIfVisible();
	var parentBox = this.box.loadParent(); 
	this.displayBox(parentBox);
};


View.prototype.pageScale = function(somePage) {
	/* returns the base scale used for rendering the page in the browser */
	
	return windowWidth /  somePage.width ;
};


View.prototype.boxScaleInBrowser = function(someBox) {
	/* returns the scale for displaying some box in the current browser */
	
	var pageScale = this.pageScale(someBox.page);
	
	// Now what's the scale for displaying the given box in the browser, knowing
	// the page scale ?
	var hScale = windowWidth / someBox.width ;
	return hScale / pageScale;
};


View.prototype.boxXInBrowser = function(someBox) {
	/* Returns the number of pixels in the browser the box is to be horizontally
	 * translated for its left edge to be displayed at the left edge of the
	 * browser.
	 */
	
	var pageScale = this.pageScale(someBox.page);
	return - (someBox.x) * pageScale;
};


View.prototype.boxYInBrowser = function(someBox) {
	/* Returns the number of pixels in the browser the box is to be vertically
	 * translated for its upper edge to be displayed at the upped edge of the
	 * browser.
	 */
	
	var pageScale = this.pageScale(someBox.page);
	return - (someBox.y) * pageScale;
};



View.prototype.showText = function(someBox) {
	
	// calculate coordinates of the text box
	var boxXInViewport = this.viewport.convertPageToViewportCoord(someBox.x); 
	var boxYInViewport = this.viewport.convertPageToViewportCoord(someBox.y); 
	
	var boxWidthInViewport = this.viewport.convertPageToViewportCoord(someBox.width); 
	var boxHeightInViewport = this.height / this.viewport.svgScale;

	// let's make sure there is some text to be shown
	if ( this.textAreaVisibility == "hidden"
		&& someBox.text != ""
		&& someBox.text != undefined) {
		
		// reset clip path
		this.removeClipPaths();
		var clipPath = svg.clipPath($("#layer1",svg.root())[0], "boxClipper");
		// Add to the clip path a rectangle the size of the box in the browser
		svg.rect(clipPath,
			boxXInViewport,
			boxYInViewport,
			boxWidthInViewport,
			boxHeightInViewport);
		// apply opacity out of slice
		$("#layer1",svg.root()).attr("clip-path","url(#boxClipper)");		
		
		// prepare a text object
		var svgLayer =  $('#layer1', svg.root());
		var svgForeignObject = svg.other(svgLayer,
			'foreignObject',
			{ x: boxXInViewport,
				y: boxYInViewport,
				width: boxWidthInViewport,
				height: boxHeightInViewport,
				id: this.box.cachedDigest
			}
		);
		var textBody = '<xhtml:body>'
			+ '<div id="content" class="textBox" '
			+ 'style="width:'
			+ boxWidthInViewport
			+ 'px;height:'
			+ boxHeightInViewport
			+ 'px;"><div class="sizeMe">';
		
		// split text by paragraphs (according to the newline character)
		var reg=new RegExp("\n", "gi");
		var textParagraphs = this.box.text.split(reg);
		for (var i = 0; i < textParagraphs.length; i++) {
			textBody = textBody
				+ '<span class="textParagraph">'
				+ textParagraphs[i]
				+ "</span>\n"
		};
		textBody = textBody
			+ '</span></div>'
			+ '</xhtml:body>'; 
		
		// add text to the box
		$("#"+someBox.cachedDigest,svg.root()).html(textBody);
		
		// size its font so that it fills and fits the box
		$("#"+someBox.cachedDigest+' div:first',svg.root()).textfill(
				{	explicitWidth: boxWidthInViewport,
					explicitHeight: boxHeightInViewport});
		
		// Let's style each line separately.
		// First, let's separate words into distinct spans.
	    $(".textParagraph").not(".separatedLines").each(function () {
	        var obj = $(this);
	        var html = obj.html().replace(/(\S+\s*)/g, '<span class="textLine">$1</span>');
	        obj.html(html);
	    });

	    // Then, let's merge spans which share the same vertical position.
	    var y = 0;
	    var spans = $(".textParagraph:not('.separatedLines') span");
	    function mergeSpansByLine() {
	        for (var i = 0; i < spans.length; i++) {
	        	// What's the vertical position of this span ?
	            var newY = spans[i].offsetTop;
	            // Is this a new line, visually ?
	            if (newY == y && i>0) {
	            	// No, it's on the same line as the last span.
	            	// Let's merge these spans together.
	            	$(spans[i]).prepend($(spans[i-1]).html()).prev().remove();
	            };
                y = newY;
	        };
	    };
	    mergeSpansByLine(); // Let's do it.

	    // remove paragraph spans
	    $(".textLine").unwrap();
	    $(".textLine").addClass("textParagraph");
	};
};


View.prototype.hideText = function(someBox) {
	$("#"+someBox.cachedDigest,svg.root()).remove();
};


View.prototype.updateText = function(someBox) {
	this.hideText(someBox);
	this.showText(someBox);
};


View.prototype.displayBox = function(someBox) {
	/* display given box */

	// hide other texts
	this.hideText(this.box);
	
	// set the box to display if needed
	if (someBox != undefined) {
		this.box = someBox;
	};
	var box = this.box;
	
	// We want to calculate the scale the box must be displayed at, so that its
	// width will fit the width of the window. But the SVG is "naturally"
	// rendered in such a way that the page for this box will fit
	// the viewport (and window) if no SVG scale is applied to the full
	// page box (or with a scale of 1). So the scaling to apply
	// must be multiplied by a base scale factor which takes into account
	// the base rendering of the image of the page in the viewport.
	
	var transfo;
	var scale = this.boxScaleInBrowser(box);
	
	if (scale != 1) {
		transfo = "scale(" + scale + ") ";
	} else {
		transfo = " ";
	};

	// Now we know the scale but we yet have to calculate the translation to
	// be applied before scaling so that the upper left corner of the box
	// will be rendered in the upper left corner of the viewport and window.

	var xInBrowser = this.boxXInBrowser(box);
	var yInBrowser = this.boxYInBrowser(box);
	if (xInBrowser != 0 || yInBrowser != 0) {
		transfo += "translate(" + xInBrowser
			+ " " + yInBrowser + ")";
	} else {
		transfo += "";
	};
	// apply svg transformation and reset clip paths
	this.removeClipPaths();

	$("#layer1",svg.root()).animate({svgTransform: transfo}, 1000);
	this.viewport.svgScale = scale;
	this.viewport.svgHorizontalTranslationInBrowser = xInBrowser;
	this.viewport.svgVerticalTranslationInBrowser = yInBrowser;

	this.createClipPath(this.box);
	
	// do we have to hide or show guides ?
	this.updateGuides();
	
	// update text area, too
	someBox.loadProperties();
	$("#textArea",svg.root()).val(someBox.text);
	
	// create text where needed if needed
	this.updateText(someBox);
	
	// scroll browser to the upper left corner
	$(window).scrollTop(0);
	$(window).scrollLeft(0);
	
	this.updateBoxHiders();
	
	// TODO : capture the image data from the SVG rect
	// TODO : reset the page and load this image
};


View.prototype.drawGuide = function(guide) {

	/* Draws a given guide. */

	var cssClass;
	if (guide.cssClass == undefined) {
		cssClass = "";
	} else {
		cssClass = " " + guide.cssClass;
	}
	var guideSettings = { class: "guide" + cssClass };
	var invisibleGuideSettings = { class:'invisibleGuide' + cssClass };
	var svgGroup =  $('#layer1', svg.root());
	var coordInPage = guide.coordInPage;
	var coordInViewport = this.viewport.convertPageToViewportCoord(coordInPage);
	var svgGuide = svg.group(svgGroup, '',
			{ id: guide.name(), class: 'guideGroup' });
	if (guide.isHorizontal == true) {
		// draw horizontal guide
		svg.line(svgGuide,
				0, coordInViewport, this.viewport.width, coordInViewport,
				invisibleGuideSettings);
		svg.line(svgGuide,
				0, coordInViewport, this.viewport.width, coordInViewport,
				guideSettings);
	} else {
		// draw vertical guide
		svg.line(svgGuide,
				coordInViewport, 0, coordInViewport, this.viewport.height,
				invisibleGuideSettings);
		svg.line(svgGuide,
				coordInViewport, 0, coordInViewport, this.viewport.height,
				guideSettings);
	};
};


View.prototype.displayFirstBox = function() {
	/* Zooms to first box */

	var firstBox = this.box.loadFirstChild();
	this.displayBox(firstBox);
};


View.prototype.displayNextBox = function() {

	/* Zooms to next box */

	this.saveTextIfVisible();
	var nextBox = this.box.loadNextSibling();
	this.displayBox(nextBox);
};


View.prototype.displayClickedBox = function(event) {
	/* display the box which was clicked on
	 * 
	 * event : mouse click
	 * 
	 * */
	var rect = event.target;
	var x = this.viewport.convertViewportToPageCoord(rect.x.baseVal.value);
	var y = this.viewport.convertViewportToPageCoord(rect.y.baseVal.value);
	var width = this.viewport.convertViewportToPageCoord(rect.width.baseVal.value);
	var height = this.viewport.convertViewportToPageCoord(rect.height.baseVal.value);
	if (x != this.box.x
		|| y != this.box.y
		|| width != this.box.width
		|| height != this.box.height) {
		var clickedBox = new Box(this,
			this.box.page,
			x, y, width, height,
			this.box);
		this.displayBox(clickedBox);
	};
};


View.prototype.reload = function() {
	this.editMode = false;
	this.viewport.resize();
	this.box.loadProperties();
	this.updateBoxHiders();
	//this.updateGuides();
};

View.prototype.handleText = function() {
	var text;
	if (this.textAreaVisibility == "hidden") {
		// it was hidden
		this.textAreaVisibility = "visible";
		this.box.loadProperties();
		text = this.box.text;
		$("#textArea",svg.root()).val(text);
		this.hideText(this.box);
	} else {
		// it was visible
		this.textAreaVisibility = "hidden";
		text = $("#textArea",svg.root()).val();
		this.box.text = text;
		this.box.saveProperties();
		// reset the text area
		$("#textArea",svg.root()).val("");
		this.showText(this.box);
	};
};

