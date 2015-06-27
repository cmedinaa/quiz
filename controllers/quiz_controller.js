var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				//console.log(quiz);
				req.quiz = quiz;
				next();
			}
			else {
				next(new Error('No existe el quiz = ' + quizId));
			}
		}
	).catch(function(error) { next(error); });
};

exports.index = function(req, res, next) {	
	var criteria = {};

	if (req.query.search) {
		//buscar la pregunta y enviar al quizes index
		var search =  req.query.search.toUpperCase().replace(/ /g, '%').trim();
		search = '%' + search + '%';
		criteria = {where: ["upper(pregunta) like ?", search]};
	}

	models.Quiz.findAll(criteria).then(
		function(quizes) {
			if (quizes && quizes.length) {
				res.render('quizes/index', {quizes: quizes, errors: []});
			}
			else {
				next(new Error('No hay preguntas con el texto "' + req.query.search + '"'));
			}
		}
	).catch(function(error) { next(error); });
};

exports.show = function(req, res) {
  	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

exports.answer = function(req, res) {
	var result = 'Incorrecto';

	if (req.query.respuesta.toUpperCase().trim() === req.quiz.respuesta.toUpperCase().trim() ) {
		result = "Correcto";
	}

	res.render('quizes/answer', {quiz: req.quiz, respuesta: result, errors: []});
};

exports.new = function(req, res) {
	var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta", tema: "otro"} );
	res.render('quizes/new', {quiz: quiz, errors: []});
}

exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(
		function (err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			}
			else {
				quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(
					function() {
					    res.redirect('/quizes');
					});
			}
		}
	)
};

exports.edit = function(req, res) {
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(
		function(err) {
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors });
			}
			else {
				req.quiz
				.save( {fields: ["pregunta", "respuesta", "tema"]} )
				.then( function() {
					res.redirect('/quizes');
				});
			}
		}
	);
};

exports.destroy = function(req, res, next) {
	req.quiz.destroy().then(
		function() {
			res.redirect('/quizes');
		}
	).catch(function(error) {
		next(error);
	});
};
