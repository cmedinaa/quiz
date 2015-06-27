module.exports = function(sequilize, DataTypes) {
	return sequilize.define('Quiz', 
		{ pregunta: {
				type: DataTypes.STRING
				, validate: { notEmpty: {msg: "-> Falta pregunta"}}
		   }
		  ,respuesta: {
		  		type: DataTypes.STRING
		  		, validate: { notEmpty: {msg: "-> Falta respuesta "}}
		  	}
		  , tema: {
		  		type: DataTypes.STRING
		  		, validate: { notEmpty: {msg: "-> Falta el tema "}}
		  }
		}
	);
}