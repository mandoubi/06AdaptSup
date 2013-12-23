var helper = require('../helpers/helpers');

/*
	index Action
 */
exports.index = function(req, res) {
	console.log("initialised ... ");
};


/**
 * Crop Image
 */
exports.cropImage = function(req, res) {
	console.log("create");
	console.log(req.body.DataCrop);

	var gd = require('node-gd');
	// var fs = require('fs');
	var path = require('path');
	var filesPath = './';

	var extension = helper.getFileExtension(req.body.DataCrop.srcImg);

	var source = req.body.DataCrop.srcImg;
	var targetImage = 'files/decoup.thumb_' + Math.random() + extension;
	var target = filesPath + targetImage;

	console.log("the path ==> ");
	// if (!helper.fileExists(source)) {
	// 	return "error";
	// }

	if (extension == ".png") {
		// Load existing image file on disk into memory
		gd.openPng(source, function(err, input_img) {

			// Create blank new image in memory
			output_img = gd.create(req.body.DataCrop.w, req.body.DataCrop.h);

			// Render input over the top of output
			// input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH
			input_img.copyResampled(
			output_img,
			0 /*dstX*/ ,
			0 /*dstY*/ ,
			req.body.DataCrop.x /*srcX*/ ,
			req.body.DataCrop.y /*srcY*/ ,
			req.body.DataCrop.w /*dstW*/ ,
			req.body.DataCrop.h /*dstH*/ ,
			req.body.DataCrop.w /*srcW*/ ,
			req.body.DataCrop.h /*srcH*/ );

			//# Write image buffer to disk
			output_img.savePng(target, 0, function(err) {
				return res.jsonp(targetImage);
			});
		});
	} else if (extension == ".jpg") {
		// Load existing image file on disk into memory
		gd.openJpeg(source, function(err, input_img) {

			// Create blank new image in memory
			output_img = gd.create(req.body.DataCrop.w, req.body.DataCrop.h);

			// Render input over the top of output
			//input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH
			input_img.copyResampled(
			output_img,
			0 /*dstX*/ ,
			0 /*dstY*/ ,
			req.body.DataCrop.x /*srcX*/ ,
			req.body.DataCrop.y /*srcY*/ ,
			req.body.DataCrop.w /*dstW*/ ,
			req.body.DataCrop.h /*dstH*/ ,
			req.body.DataCrop.w /*srcW*/ ,
			req.body.DataCrop.h /*srcH*/ );

			//# Write image buffer to disk
			output_img.saveJpeg(target, 0, function(err) {
				return res.jsonp(targetImage);
			});
		});
	}


};


/* Based on node-teseract module*/
exports.oceriser = function(req, res) {

	console.log("oceriser");

	var exec = require('child_process').exec;
	fs = require('fs');
	crypto = require('crypto');

	var image = './' + req.body.sourceImage;
	var date = new Date().getTime();
	var output = crypto.createHash('md5').update(image + date).digest("hex") + '.tif';

	console.log("convert " + image + " -type Grayscale " + output);
	exec("convert " + image + " -type Grayscale " + output, function(err, stdout, stderr) {

		fs.exists(output, function(exists) {
			console.log((exists ? "File is there" : "File is not there"));
			return "error";
		});

		// console.log(output);

		//if(err) throw err;
		//console.log("tesseract " + output + " " + output + " -psm 047"); tesseract image.png out -l fra
		exec("tesseract " + output + " " + output + " -l fra", function(err, stdout, stderr) {
			if (err) throw err;
			fs.readFile(output + '.txt', function(err, data) {
				if (err) throw err;
				// text = data.toString('utf8').replace(/\W/g, ' ');
				text = data.toString('utf8');
				console.log("text OCR in server ==> " + text);
				res.jsonp(text);
				fs.unlink(output + '.txt', function(err) {
					if (err) throw err;
					fs.unlink(output, function(err) {
						if (err) {
							throw err;
						}
					});
				});
			});
		});
	});

}

/* Upload Files */
exports.uploadFiles = function(req, res) {

	fs = require('fs');
	var sources = [];
	// Detect file type
	var extension = helper.getFileExtension(req.files.uploadedFile.originalFilename);
	console.log("extension is ==> " + extension);

	fs.readFile(req.files.uploadedFile.path, function(err, data) {
		// ...
		var newPath = "./files/" + req.files.uploadedFile.originalFilename;
		fs.writeFile(newPath, data, function(err) {
			// res.redirect("back");
			console.log(newPath);
			if (extension == '.pdf') {
				// (if PDF convert to PNGs)
				sources = exports.convertsPdfToPng(newPath, res);
				// console.log("result of converts ==> ");
				// console.log(sources);
				// return res.jsonp(sources);
			} else {
				sources.push(newPath);
				return res.jsonp(sources);
			}
		});
	});
}


/* Convert PDF to PNG */
exports.convertsPdfToPng = function(source, res) {

	var fs = require('fs');

	console.log("the source is ==> ");
	console.log(source);
	var imageFileName = source.substr(0, source.lastIndexOf('.')) + Math.random();
	console.log("imageFileName ==> ");
	console.log(imageFileName);

	var sys = require('sys');
	var exec = require('child_process').exec;

	// Render image with imagemagick
	exec("convert " + source + " " + imageFileName + ".png ", function(error, stdout, stderr) {
		if (error !== null) {
			console.log(error);
			return "error";
		} else {
			console.log('[Done] Conversion from PDF to PNG image' + imageFileName + '.png');

			// Get converted files by Command
			exec("ls files | grep  " + imageFileName.substr(8, imageFileName.length), function(errorls, stdoutls, stderrls) {

				if (errorls !== null) {
					console.log(errorls);
					return "error";
				}

				var sources = [];
				var files = stdoutls.replace(/\n/g, " ").split(" ");
				for (var i = 0; i < files.length; i++) {
					if (files[i] != '') {
						sources.push("./files/" + files[i]);
					}
				};
				console.log(files);
				console.log(sources);
				return res.jsonp(sources);


			});

		}
	});
}