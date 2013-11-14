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

function manipulate(root){
		
	// Remove placeholders
	$('.stub', root).replaceWith("");
	
	var partsOfPageName = pageName.split('/');
	var fileName = partsOfPageName[partsOfPageName.length - 1];
	var partsOfFileName = fileName.split('.');
	var fileExtension = ".png";
	var defaultFilePrefix = fileName + "-";
	if (partsOfFileName.length != 1) { // there IS a file extension in the page name
		fileExtension = "." + partsOfFileName[partsOfFileName.length - 1];
        defaultFilePrefix = fileName.substring(0, pageName.length - fileExtension.length) + "-";
	};
	var filePrefix = getUrlParameter(this.location, "filePrefix", defaultFilePrefix);
	
	// Load the "next" arrow
    $('#arrowNext',svg.root).attr("xlink:href", "templates/guillotine/arrowNext.png");
	
	// load direct parts of this image
	// We will try to load files representing parts of the image by means of
	// guessing their file names on the basis of the name of the image.
	// usually, we have fileNameOfPart = filePrefix + xIndex + "-" + yIndex + fileExtension
	var xIndex = 0;
	var yIndex = 0;
	loadSvgImage(xIndex, yIndex, pageName, filePrefix, fileExtension);
};

function loadSvgImage(xIndex, yIndex, pageName, filePrefix, fileExtension) {
	var partUrl = 'pages/' + pageName + '/' + filePrefix + xIndex + "-" + yIndex + fileExtension;
	var imageId = "image-" + xIndex + "-" + yIndex;
	var svgLink = svg.link("?page=" + pageName + "&filePrefix=" + filePrefix + xIndex + "-" + yIndex + "-");
	var svgImage = svg.image(svgLink, 0, 0, 0, 0, partUrl, { id: imageId });
	var img = new Image();
	img.onload = function() {
  		adjustImageAndLoadNext(imageId,
					  		   xIndex,
							   yIndex,
							   this.width,
							   this.height,
							   pageName,
							   filePrefix,
							   fileExtension);
	};
	img.onerror = function () {
		tryLoadingNextImage(xIndex,
							yIndex,
							pageName,
							filePrefix,
							fileExtension);
	};
	img.src = partUrl;
	/* Alternatives :
	 * - charger une Image() à côté et redimensionner svgImage quand elle est prête
	 * - placer onLoad sur un objet image qui serait rattaché à svgImage : inspecter
	 * - dder à keith wood
	 */
	// now the audio
	audioUrl = partUrl + ".txt.au.ogg";
	audioHtml = '<audio loop src="' + audioUrl + '" ';
	audioHtml += 'begin="' + imageId + '.mouseover" ';
	audioHtml += 'id="audio_' + imageId + '" />';
	$("#load").append(audioHtml);
};

function adjustImageAndLoadNext(imageId,
								xIndex,
								yIndex,
								width,
								height,
								pageName,
								filePrefix,
								fileExtension) {
	// update size
	var image = $("#" + imageId, svg.root);
	image.attr("width", width);
	image.attr("height", height);
	// update x
	if (xIndex > 0) {
		var xIndexOnLeft = xIndex - 1;
		idOfSvgImageOnLeft = "image-" + xIndexOnLeft + "-" + yIndex;
		svgImageOnLeft = $("#" + idOfSvgImageOnLeft, svg.root);
		var xOnLeft = parseInt(svgImageOnLeft.attr("x"));
		var widthOnLeft = parseInt(svgImageOnLeft.attr("width"));
		image.attr("x", xOnLeft + widthOnLeft);
	};
	// update y
	if (yIndex > 0) {
		var yIndexAbove = yIndex - 1;
		idOfSvgImageAbove = "image-" + xIndex + "-" + yIndexAbove;
		svgImageAbove = $("#" + idOfSvgImageAbove, svg.root);
		var yAbove = parseInt(svgImageAbove.attr("y"));
		var heightAbove = parseInt(svgImageAbove.attr("height"));
		image.attr("y", yAbove + heightAbove);
	};
	yIndex += 1;
	// next step
	loadSvgImage(xIndex, yIndex, pageName, filePrefix, fileExtension);
};

function resizeAll(contentWidth, contentHeight, pageName, imageName, fileExtension) {
	// consider size of canvas
	var canvasWidth = svg.root().getAttribute("width");
	var canvasHeight;
	var ratio = contentWidth / canvasWidth;
	if (ratio != 1) { // oops, canvas is too tight
		// then resize the parts
		$("image", svg.root).attr("transform", "scale(" + 1/ratio + ")");
		$("#arrowNext",svg.root).attr("transform","");
		contentHeight = contentHeight / ratio;
	};
	// resize all as needed
	var arrowHeight = 73 * 2;
	var arrowWidth = 283;
	var spaceAboveArrow = 40;
	canvasHeight = contentHeight + spaceAboveArrow + arrowHeight;
	svg.root().setAttribute("height",canvasHeight);
	// prepare the "next" arrow
	$('#arrowNext', svg.root).attr("x", canvasWidth / 2 - arrowWidth / 2);
	$('#arrowNext', svg.root).attr("y", contentHeight + spaceAboveArrow);
	// find link to next part or page
	var partsOfPageName = pageName.split('/');
	var fileNameWithoutExtension = partsOfPageName[partsOfPageName.length - 1];
	if (fileNameWithoutExtension.substring(fileNameWithoutExtension.length - fileExtension.length) == fileExtension) {
		fileNameWithoutExtension = fileNameWithoutExtension.substring(0, fileNameWithoutExtension.length - fileExtension.length);
	};
	var index = imageName.substring(fileNameWithoutExtension.length, imageName.length - fileExtension.length);
	if (index[0] == "-") {
		// remove "-" if present at start
		index = index.substring(1, index.length);
	};
	index = index.split("-"); // now an array of [x0, y0, x1, y1, ...]
	// convert into an array of integers
	for (i in index) {
		index[i] = parseInt(index[i]);
	}
	var nextIndex = index.slice(0); // clone
	nextIndex[nextIndex.length - 2] += 1; // increase last x index
	var filePrefix = fileNameWithoutExtension;
	var nextImage = new Image();
	var nextImage2 = new Image();
	var nextPrefix;
	nextImage.onload = function() {
		// we found our next part
		nextPrefix = filePrefix + "-" + nextIndex.join("-") + "-";
		$('#arrowNextLink', svg.root).attr("xlink:href","?page=" + pageName + "&filePrefix=" + nextPrefix);
	};
	nextImage.onerror = function() {
		// incrementing the last x index did not help
		// let's retry with the y index
		nextIndex = index.slice(0);
		nextIndex[nextIndex.length - 2] = 0; // first column
		nextIndex[nextIndex.length - 1] += 1; // increase last y index
		nextImage2.src = "pages/" + pageName + "/" + filePrefix + "-" + nextIndex.join("-") + fileExtension;
	};
	nextImage2.onload = nextImage.onload;
	nextImage2.onerror = function () {
		// incrementing the last y index did not help
		// maybe we have to get back up one level and retry with the x index ?
		if (nextIndex.length > 2) {
			nextIndex.pop(); // remove last y
			nextIndex.pop(); // remove last x
			index = nextIndex.slice(0);
			nextIndex[nextIndex.length - 2] += 1; // increase last x index 
			nextImage.src = "pages/" + pageName + "/" + filePrefix + "-" + nextIndex.join("-") + fileExtension;
		} else {
			// we can't get any further up in the index, we are already back to the starting page
			// can we get nextPage from ?
			jQuery.ajax({
				url:'pages/'+pageName+'/nextPage.txt',
	        	dataType:'text',
				async: true,
    	    	success: function(response) {
					nextPage = response;
					$('#arrowNextLink', svg.root).attr("xlink:href","?page=" + nextPage);
				},
				error: function() {
					// there is no nextPage.txt file. Any other source ?
					// did the page provide a nextPage parameter ?
					var nextPage = window.getUrlParameter(window.location, "nextPage");
					if (nextPage != undefined) {
						// nextPage is given in URL
						$('#arrowNextLink', svg.root).attr("xlink:href","?page=" + nextPage);
					} else {
						// nextPage is not given in URL
						// by default, link back to the starting page
						$('#arrowNextLink', svg.root).attr("xlink:href","?");
						// unless... do we get a page by incrementing the page name ?
						regex = new RegExp('[0-9]*$');
		    			indexOfNumber = pageName.search(regex);
						if (indexOfNumber > 0) {
							pageNumber = pageName.substring(indexOfNumber);
							numberOfNextPage = parseInt(pageNumber) + 1;
							nextPage = pageName.substring(0,indexOfNumber) + numberOfNextPage;
							nextImage = imageName.replace(pageNumber,numberOfNextPage);
							// does such a next page really exist ?
							jQuery.ajax({url:"pages/" + nextPage + "/" + nextImage,
								async: true,
								success: function () {
									// we have a "next" page. Let's link it from here.
									$('#arrowNextLink', svg.root).attr("xlink:href","?page=" + nextPage);
								}
							});	
						};
					};
				 }
			});
		};
	}; 
	nextImage.src = "pages/" + pageName + "/" + filePrefix + "-" + nextIndex.join("-") + fileExtension;
};

function tryLoadingNextImage(xIndex,
							 yIndex,
							 pageName,
							 filePrefix,
							 fileExtension) {
	if (yIndex == 0) {
		// oops, this new xIndex is empty, we're done
		var imageName = filePrefix.substring(0,filePrefix.length-1) + fileExtension;
		if (xIndex == 0) {
			// oops we haven't even loaded any part
			// Display the final part
			var image = "pages/" + pageName + "/" + imageName;
			var img = new Image();
			$('#image',svg.root).attr("xlink:href", image);
			img.onload = function () {
				// prepare image of the final part
				var contentWidth = img.width;
				var contentHeight = img.height;
				$('#image',svg.root).attr("x",0);
				$('#image',svg.root).attr("y",0);
				$('#image', svg.root).attr("width", contentWidth);
				$('#image', svg.root).attr("height", contentHeight);
				resizeAll(contentWidth, contentHeight, pageName, imageName, fileExtension);
			};
			img.src = image;
    		// now the audio
			audioUrl = image + ".txt.au.ogg";
			audioHtml = '<audio loop src="' + audioUrl + '" ';
			audioHtml += 'begin="image.mouseover" id="audio_image" />';
			$("#load").append(audioHtml);
		} else {
			// do we have parts which are larger than canvas ?
			var contentHeight = 0;
			$.each($('image[x="0"][height]',svg.root), function (index, image) {
					contentHeight += parseInt(image.getAttribute("height"));
			});
			var contentWidth = 0;
			$.each($('image[y="0"][width]',svg.root), function (index, image) {
					contentWidth += parseInt(image.getAttribute("width"));
			});
			resizeAll(contentWidth, contentHeight, pageName, imageName, fileExtension);
		};
		// Here we are. Let's add some effects.
		$("image",svg.root).attr("onmouseover","onMouseOverImage(evt)");
	} else {
		// we're done with this xIndex, let's try next one
		xIndex += 1;
		yIndex = 0;
		loadSvgImage(xIndex,
					 yIndex,
					 pageName,
					 filePrefix,
					 fileExtension);
	};
};

function onMouseOverImage(event) {
	$("audio").each(function (index) {
		this.pause();		
	});
	$("image",svg.root).attr("opacity",".2");
	$("#arrowNext",svg.root).attr("opacity","0.5");
	event.currentTarget.setAttribute("opacity","1");
	audioId = "audio_" + event.currentTarget.id;
	$('#' + audioId).each(function (index) {
		this.load();
		this.play();
	});
};