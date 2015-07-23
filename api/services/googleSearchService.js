var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var http = require('http');
var animated = require('animated-gif-detector');
var url = require('url');

var googleSearchService = module.exports;

var urlBlacklist = ['.jpg', '.jpeg'];



googleSearchService.gifSearch = function (query, ip) {
	console.log('starting')
	// lazy load urlBlacklist
	if(urlBlacklist.length == 2){
		return GifBlacklist.find({}).limit(false).then(function (blacklist) {
			_.each(blacklist, function (item) {
				urlBlacklist.push(item.domain);
			});
			return googleSearchService.gifSearch(query, ip);
		});
	}

	var images = [];

	var options = {
		json: true,
		url: 'https://ajax.googleapis.com/ajax/services/search/images',
		qs: {
			v: '1.0',
			rsz: 8,
			safe: 'active',
			imgType: 'animated',
			start: 0,
			userip: ip,
			q: query
		}
	};

	return request.getAsync(options).spread(handleImageSearch);

	function handleImageSearch(response, body) {
		var newImages = _.map(body.responseData.results, function (image) {
			return image.unescapedUrl;
		});

		// push new images onto images list
		images.push.apply(images, newImages);

		console.log('all images', JSON.stringify(images));

		return findSuitableImage();
	}

	function findSuitableImage() {
		images = _.filter(images, function (image) {
			return !_.any(urlBlacklist, function (url) {
				return image.indexOf(url) > -1;
			})
		});

		if (images.length < 4) {
			options.qs.start = options.qs.start + 8;
			console.log('loading more images');
			return request.getAsync(options).spread(handleImageSearch);
		}

		console.log('images before sample', JSON.stringify(images));

		// pick a random image
		var image = _.sample(images);
		//var image = images[0];
		console.log('image chosen', image);
		var domain = url.parse(image).hostname;

		return checkIfAnimated(image)
			.then(function () {
				return image;
			})
			.catch(function () {
				console.log('adding url to blacklist', domain);
				// we don't care when this finishes since list is loaded on boot and cached in memory
				GifBlacklist.create({domain: domain}).then(noop);
				urlBlacklist.push(domain);

				removeImageFromList(image);
				console.log('all images (adding to blacklist)', JSON.stringify(images));
				return findSuitableImage();
			});
	}

	function removeImageFromList(image) {
		images.splice(_.indexOf(images, image), 1);
	}

	function checkIfAnimated(image) {
		var chunks = 0;
		return new Promise(function (resolve, reject) {
			var req = request(image);

			//req.on('data', function (data) {
			//	// don't load the whole image. Animated usually found around chunk 5
			//	chunks++;
			//	if (chunks > 10) {
			//		req.abort();
			//		reject(image);
			//	}
			//})
			req.pipe(animated())
				.once('animated', function () {
					req.abort();
					console.log('animated yay', image);
					resolve(image);
				})
				.on('error', function (err) {
					reject(err);
				})
				.on('finish', function () {
					console.log('welp not animated')
					reject(image);
				});
		});
	}
};


googleSearchService.imageSearch = function (query) {
	// supposedly this API was turned off a year ago but still seems to work :shrug:
	// there is a new API with a 100 / day limit but I couldn't get it working :fistshake:
	// notes for new api


	return request.getAsync({
		json: true,
		url: 'https://ajax.googleapis.com/ajax/services/search/images',
		qs: {
			v: '1.0',
			rsz: 8,
			safe: 'active',
			q: query
		}
	})
		.spread(function (response, body) {
			return _.sample(body.responseData.results).unescapedUrl;
		});
};

function noop() {

}