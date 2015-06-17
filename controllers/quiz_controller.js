var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
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
	if (req.query.search) {
		//buscar la pregunta y enviar al quizes index
		var search =  req.query.search.toUpperCase().replace(/ /g, '%').trim();
		search = '%' + search + '%';
		models.Quiz.findAll({where: ["upper(pregunta) like ?", search]}).then(
			function(quizes) {
				if (quizes && quizes.length) {
					res.render('quizes/index', {quizes: quizes});
				}
				else {
					next(new Error('No hay preguntas con el texto "' + req.query.search + '"'));
				}
			}
		).catch(function(error) { next(error); });
	}
	else {
		//mostrar el formulario de búsqueda
		res.render('quizes/search');
	}
};

exports.show = function(req, res) {
  	res.render('quizes/show', {quiz: req.quiz});
};

exports.answer = function(req, res) {
	var result = 'Incorrecto';

	if (req.query.respuesta.toUpperCase().trim() === req.quiz.respuesta.toUpperCase().trim() ) {
		result = "Correcto";
	}

	res.render('quizes/answer', {quiz: req.quiz, respuesta: result});
};
