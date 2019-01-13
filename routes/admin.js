var express = require('express');
var router = express.Router();
const {
	body
} = require('express-validator/check');
var multer = require('multer')
var upload = multer({
	dest: 'uploads/'
});

// var Form = require('../database/forms');
var Content = require('../database/content');
var ContentType = require('../database/contentType');
var Option = require('../database/options');
var Page = require('../database/pages');

var contentTypes = ContentType.find({}).exec();

router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'Express', contentTypes: contentTypes });
});

router.get('/content-types/create', function(req, res, next) {
	res.render('admin/content-types/form', {
		csrf: req.csrfToken()
	});
});

router.get('/pages/create', function (req, res, next) {
	res.render('admin/pages/builder', {
		contentTypes: contentTypes,
		csrf: req.csrfToken()
	});
});

router.get('/pages/:id/edit', function (req, res, next) {
	res.render('admin/pages/builder', {
		el: Page.findById(req.params.id),
		csrf: req.csrfToken()
	});
});

router.get('/navigation/create', function (req, res, next) {
	res.render('admin/navigation/builder');
});

router.get('/list/:module', function(req, res, next) {
	let model = req.params.module.capitalize();
	res.send(model);
});

router.get('/content-types/create', function(req, res, next) {
	res.render('form', {
		'templates': []
	});
});

router.post('/content-types', [
	body('title').isString().not().isEmpty().trim().escape(),
	body('description').isString().trim().escape(),
	body('template').not().isEmpty().toInt(),
	body('fields').trim()
], (req, res, next) => {
	ContentType.create({ 
		title: req.body.title.capitalize(), 
		description: req.body.description, 
		template: req.body.template, 
		fields: JSON.parse(req.body.fields),
		created: new Date(),
		updated: new Date()
	}, function (err, el) {
		if (err) console.log(err);

		res.send({'isSuccess': true});
	});
});

router.post('/options', [
	body('option').isString().not().isEmpty().trim().escape(),
	body('type').isString().not().isEmpty().trim().escape(),
	body('name').isString().not().isEmpty().trim().escape(),
	body('value').trim()
], (req, res, next) => {
	Option.create({
		type: req.body.type,
		name: req.body.name,
		value: JSON.parse(req.body.value)
	}, function (err, el) {
		res.send({
			'isSuccess:': true
		});
	});
});

router.put('/options/:id', [
	body('option').isString().not().isEmpty().trim().escape(),
	body('type').isString().not().isEmpty().trim().escape(),
	body('name').isString().not().isEmpty().trim().escape(),
	body('value').trim()
], (req, res, next) => {
	Option.findByIdAndUpdate(
		req.params.id,
		{
			type: req.body.type, 
			name: req.body.name, 
			value: JSON.parse(req.body.value)
		},
		{
			new: true
		},
		(err, option) => {
			if (err) return res.status(500).send(err);

			return res.send(option);
		}
	)
});

router.post('/content', [
	body('title').isString().not().isEmpty().trim().escape(),
	body('options').trim(),
	body('fields').trim()
], (req, res, next) => {
	ContentType.create({
		title: req.body.title,
		fields: JSON.parse(req.body.fields),
		options: JSON.parse(req.body.options),
		created: new Date(),
		updated: new Date()
	}, function (err, el) {
		res.send({'isSuccess:': true});
	});
});

router.put('/content/:id', [
	body('title').isString().not().isEmpty().trim().escape(),
	body('options').trim(),
	body('fields').trim()
], (req, res, next) => {
	ContentType.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			fields: JSON.parse(req.body.fields),
			options: JSON.parse(req.body.options),
			updated: new Date()
		},
		{
			new: true
		},
		(err, el) => {
			if (err) return res.status(500).send(err);
			return res.send(el);
		}
	)
});

router.post('/forms', [
	body('title').isString().not().isEmpty(),
	body('options').trim()
], (req, res, next) => {
	Form.create({
		title: req.body.title,
		options: JSON.parse(req.body.options),
		created: new Date(),
		updated: new Date()
	}, function (err, el) {
		res.send({'isSuccess': true});
	});
});

router.put('/forms/:id', [
	body('title').isString().not().isEmpty(),
	body('options').trim()
], (req, res, next) => {
	Form.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			options: JSON.parse(req.body.options),
			updated: new Date()
		},
		{new: true},
		(err, el) => {
			if (err) return res.status(500).send(err);
			return res.send(el);
		}
	)
});

router.post('/pages', [
	body('title').isString().not().isEmpty().trim().escape(),
	body('slug').isString().not().isEmpty().trim().escape(),
	body('content').isString().not().isEmpty().trim().escape(),
	body('options').trim()
], (req, res, next) => {
	Page.create({
		title: req.body.title,
		slug: req.body.slug,
		content: req.body.content,
		options: JSON.parse(req.body.options),
		created: new Date(),
		updated: new Date()
	}, function (err, el) {
		res.send({ 'isSuccess': true });
	});
});

router.put('/pages/:id', [
	body('title').isString().not().isEmpty().trim().escape(),
	body('slug').isString().not().isEmpty().trim().escape(),
	body('content').isString().not().isEmpty().trim().escape(),
	body('options').trim()
], (req, res, next) => {
	Page.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			slug: req.body.slug,
			content: req.body.content,
			options: JSON.parse(req.body.options)
		},
		{new: true},
		(err, el) => {
			if (err) return res.status(500).send(err);
			return res.send(el);
		}
	);
});

router.post('/media', upload.single('file'), (req, res, next) => {
	Media.create({
		name: req.file.filename,
		path: req.file.path,
		size: req.file.size,
		mimetype: req.file.mimetype
	}, function (err, el) {
		res.send({ 'isSuccess': true });
	});
});

router.delete('/media/:id', (req, res, next) => {
	Media.findByIdAndDelete(req.params.id, (err, el) => {
		if (err) return res.status(500).send(err);

		return res.send(el);
	});
});

module.exports = router;