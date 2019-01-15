var express = require('express');
var router = express.Router();
const {
	body
} = require('express-validator/check');
var multer = require('multer')
var upload = multer({
	dest: 'uploads/'
});

function isLogged(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.redirect('/zulu/login');
	}
}

var Content = require('../database/content');
var ContentType = require('../database/contentType');
var Option = require('../database/options');
var Page = require('../database/pages');
var Media = require('../database/media');
var User = require('../database/user');

var contentTypes = ContentType.find({}).exec();

router.get('/', isLogged, function(req, res, next) {
  res.render('dashboard', { title: 'Express', contentTypes: contentTypes });
});

router.get('/content-types/create', isLogged, function(req, res, next) {
	res.render('admin/content-types/form', {
		csrf: req.csrfToken()
	});
});

router.get('/content-types', isLogged, function (req, res, next) {
	ContentType.find({}).exec((err, types) => {
		res.render('admin/list', {
			module: 'content-types',
			csrf: req.csrfToken(),
			els: types,
			contentTypes: types,
			columns: [
				{ heading: 'Име', target: 'title' }, { heading: 'Описание', target: 'description' }, { heading: 'Създаден на', target: 'created' }
			]
		});
	});
});

router.get('/content-types/:name', isLogged, function (req, res, next) {
	ContentType.find({title: req.params.name}).exec((err, types) => {
		res.render('admin/list', {
			module: 'content-types',
			csrf: req.csrfToken(),
			els: types,
			contentTypes: types,
			columns: [{
				heading: 'Име',
				target: 'title'
			}, {
				heading: 'Описание',
				target: 'description'
			}, {
				heading: 'Създаден на',
				target: 'created'
			}]
		});
	});
});


router.get('/pages', isLogged, function (req, res, next) {
	Page.find({}).exec((err, results) => {
		ContentType.find({}).exec((err, types) => {
			res.render('admin/list', {
				module: 'pages',
				csrf: req.csrfToken(),
				els: results,
				contentTypes: types,
				columns: [
					{heading: 'Име', target: 'title'}, {heading: 'Връзка', target: 'slug'}, {heading: 'Създаден на', target: 'created'}
				]
			});
		});
	});
});

router.get('/content', isLogged, function (req, res, next) {
	Content.find({}).exec((err, results) => {
		ContentType.find({}).exec((err, types) => {
			res.render('admin/list', {
				module: 'content',
				csrf: req.csrfToken(),
				els: results,
				contentTypes: types,
				columns: [
					{ heading: 'Име', target: 'title' }, { heading: 'Връзка', target: 'slug' }, { heading: 'Създаден на', target: 'created' }
				]
			});
		});
	});
});

router.get('/navigations', isLogged, function (req, res, next) {
	Option.find({type: 'navigation'}).exec((err, results) => {
		ContentType.find({}).exec((err, types) => {
			res.render('admin/list', {
				module: 'navigations',
				csrf: req.csrfToken(),
				els: results,
				contentTypes: types,
				columns: [
					{ heading: 'Тип', target: 'type' }, { heading: 'Наименование', target: 'name' }
				]
			});
		});
	});
});


router.get('/pages/create', isLogged, function (req, res, next) {
	res.render('admin/pages/builder', {
		contentTypes: contentTypes,
		csrf: req.csrfToken()
	});
});

router.get('/pages/:id/edit', isLogged, function (req, res, next) {
	Page.findById(req.params.id).exec((err, result) => {
		if (err) res.status(500).send(err);
		
		res.render('admin/pages/builder', {
			el: result,
			csrf: req.csrfToken()
		});
	});
});

router.get('/posts/create', isLogged, function (req, res, next) {
	res.render('admin/posts/form', {
		csrf: req.csrfToken()
	});
});

router.get('/posts/:id/edit', isLogged, function (req, res, next) {
	res.render('admin/posts/form', {
		el: {},
		csrf: req.csrfToken()
	});
});

router.get('/navigations/create', isLogged, function (req, res, next) {
	res.render('admin/navigation/builder', {
		csrf: req.csrfToken()
	});
});

router.get('/navigations/:id/edit', isLogged, function (req, res, next) {
	res.render('admin/navigation/builder', {
		csrf: req.csrfToken()
	});
});

router.get('/forms/create', isLogged, function (req, res, next) {
	res.render('admin/forms/builder', {
		csrf: req.csrfToken()
	});
});

router.get('/list/:module', isLogged, function(req, res, next) {
	let model = req.params.module.capitalize();
	res.send(model);
});

router.get('/content/:type/create', isLogged, function (req, res, next) {
	ContentType.find({title: req.params.type}).exec((err, result) => {
		res.render('admin/content/form', {
			contentType: result,
			csrf: req.csrfToken()
		});
	});
});

router.get('/content/:id/edit', isLogged, function (req, res, next) {
	Content.findById(req.params.id, (err, result) => {
		res.render('admin/content/form', {
			el: result,
			csrf: req.csrfToken()
		});
	});
});

router.get('/content-types/create', isLogged, function(req, res, next) {
	res.render('admin/content-types/form', {
		templates: [],
		csrf: csrfToken()
	});
});

router.get('/content-types/:id/edit', isLogged, function (req, res, next) {
	ContentType.findById(req.params.id, (err, result) => {
		res.render('admin/content-types/form', {
			el: result,
			csrf: req.csrfToken()
		})
	});
});

router.post('/content-types', isLogged, [
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
		res.send(el);
	});
});

router.put('/content-types/:id', isLogged, [
	body('title').isString().not().isEmpty().trim().escape(),
	body('description').isString().trim().escape(),
	body('template').not().isEmpty().toInt(),
	body('fields').trim()
], (req, res, next) => {
	ContentType.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title.capitalize(),
			description: req.body.description,
			template: req.body.template,
			fields: JSON.parse(req.body.fields),
			updated: new Date()
		},
		{
			new: true
		},
		(err, el) => {
			if (err) return res.status(500).send(err);
			return res.send(el);
		}
	);
});

router.delete('/content-types/:id', isLogged, (req, res, next) => {
	ContentType.findByIdAndDelete(req.params.id, (err, el) => {
		if (err) return res.status(500).send(err);
		return res.send(el);
	});
});

// router.post('/posts', [
// 	body('title').isString().not().isEmpty().trim().escape(),
// 	body('slug').isString().not().isEmpty().trim(),
// 	body('content').trim()
// ], (req, res, next) => {

// 	console.log(req.body.content);

// 	Post.create({
// 		title: req.body.title,
// 		slug: req.body.slug,
// 		content: req.body.content
// 	}, function (err, el) {
// 		res.send(el);
// 	});
// });

// router.put('/posts/:id', [
// 	body('title').isString().not().isEmpty().trim().escape(),
// 	body('slug').isString().not().isEmpty().trim(),
// 	body('content').trim()
// ], (req, res, next) => {
// 	Post.findByIdAndUpdate(
// 		req.params.id, 
// 		{
// 			title: req.body.title,
// 			slug: req.body.slug,
// 			content: req.body.content
// 		}, 
// 		{
// 			new: true
// 		},
// 		(err, el) => {
// 			if (err) return res.status(500).send(err);
// 			return res.send(el);
// 		}
// 	);
// });

router.post('/options', isLogged, [
	body('type').isString().not().isEmpty().trim().escape(),
	body('name').isString().not().isEmpty().trim().escape(),
	body('value').trim()
], (req, res, next) => {
	Option.create({
		type: req.body.type,
		name: req.body.name,
		value: JSON.parse(req.body.value)
	}, function (err, el) {
		res.send(el);
	});
});

router.put('/options/:id', isLogged, [
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
	);
});

router.post('/content', isLogged, [
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

router.put('/content/:id', isLogged, [
	body('title').isString().not().isEmpty().trim().escape(),
	body('options').trim(),
	body('fields').trim()
], (req, res, next) => {
	Content.findByIdAndUpdate(
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

router.delete('/content/:id', isLogged, (req, res, next) => {
	Content.findByIdAndDelete(req.params.id, (err, el) => {
		if (err) return res.status(500).send(err);
		return res.send(el);
	});
});

// router.post('/forms', [
// 	body('title').isString().not().isEmpty(),
// 	body('options').trim()
// ], (req, res, next) => {
// 	Form.create({
// 		title: req.body.title,
// 		options: JSON.parse(req.body.options),
// 		created: new Date(),
// 		updated: new Date()
// 	}, function (err, el) {
// 		res.send({'isSuccess': true});
// 	});
// });

// router.put('/forms/:id', [
// 	body('title').isString().not().isEmpty(),
// 	body('options').trim()
// ], (req, res, next) => {
// 	Form.findByIdAndUpdate(
// 		req.params.id,
// 		{
// 			title: req.body.title,
// 			options: JSON.parse(req.body.options),
// 			updated: new Date()
// 		},
// 		{new: true},
// 		(err, el) => {
// 			if (err) return res.status(500).send(err);
// 			return res.send(el);
// 		}
// 	)
// });

router.post('/pages', isLogged, upload.none(), [
	body('title').isString().not().isEmpty().trim().escape(),
	body('slug').isString().not().isEmpty().trim().escape(),
	body('content').trim()
], (req, res, next) => {
	Page.create({
		title: req.body.title,
		slug: req.body.slug,
		content: JSON.parse(req.body.content),
		created: new Date(),
		updated: new Date()
	}, function (err, el) {
		res.send(el);
	});
});

router.put('/pages/:id', isLogged, [
	body('title').isString().not().isEmpty().trim().escape(),
	body('slug').isString().not().isEmpty().trim().escape(),
	body('content').trim()
], (req, res, next) => {
	Page.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			slug: req.body.slug,
			content: JSON.parse(req.body.content)
		},
		{new: true},
		(err, el) => {
			if (err) return res.status(500).send(err);
			return res.send(el);
		}
	);
});

router.delete('/pages/:id', isLogged, (req, res, next) => {
	Page.findByIdAndDelete(req.params.id, (err, el) => {
		if (err) return res.status(500).send(err);
		return res.send(el);
	});
});

router.get('/media', isLogged, function (req, res, next) {
	Media.find({}).exec((err, result) => {
		ContentType.find({}).exec((err, types) => {
			res.render('admin/media/uploader', {
				els: result,
				contentTypes: types,
				csrf: req.csrfToken()
			});
		});
	});
});

router.post('/media', isLogged, upload.single('file'), (req, res, next) => {
	Media.create({
		name: req.file.filename,
		path: req.file.path,
		size: req.file.size,
		mimetype: req.file.mimetype,
		original: req.file.originalname,
		created: new Date(),
		updated: new Date()
	}, function (err, el) {
		res.send({ 'isSuccess': true });
	});
});

router.delete('/media/:id', isLogged, (req, res, next) => {
	Media.findByIdAndDelete(req.params.id, (err, el) => {
		if (err) return res.status(500).send(err);
		return res.send(el);
	});
});

router.get('/users/create', isLogged, function (req, res, next) {
	res.render('admin/users/form', {
		csrf: req.csrfToken()
	});
});

router.get('/users', isLogged, function (req, res, next) {
	User.find({}).exec((err, types) => {
		res.render('admin/list', {
			module: 'users',
			csrf: req.csrfToken(),
			els: types,
			contentTypes: types,
			columns: [{
				heading: 'Електронна поща',
				target: 'email'
			}, {
				heading: 'Salt',
				target: 'Salt'
			}, {
				heading: 'Създаден на',
				target: 'created'
			}]
		});
	});
});

router.post('/users', [
	body('email').isEmail().not().isEmpty().trim().escape(),
	body('password').isString().not().isEmpty(),
	body('active').trim().escape()
], (req, res, next) => {
	User.create({
		email: req.body.email,
		password: req.body.password
	}, function (err, el) {
		res.send(el);
	});
});

router.put('/users/:id', [
	body('email').isEmail().not().isEmpty().trim().escape(),
	body('password').isString().not().isEmpty(),
	body('active').trim().escape()
], (req, res, next) => {
	User.findByIdAndUpdate(
		req.params.id,
		{
			email: req.body.email,
			password: req.body.password
		},
		{
			new: true
		},
		(err, el) => {
			if (err) res.status(500).send(err);
			res.send(el);
		}
	);
});

router.delete('/users/:id', (req, res, next) => {
	User.findByIdAndDelete(req.params.id, (err, el) => {
		if (err) return res.status(500).send(err);
		return res.send(el);
	});
});

module.exports = router;