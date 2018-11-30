
const formParser = require('./form-parser')
const hello = (event, context, callback) => {
	formParser.parse(event).then((data) => {
	    const response = {
	        statusCode: 200,
	        body: JSON.stringify(data),
	        headers: {
	          'Access-Control-Allow-Origin': '*',
	          'Access-Control-Allow-Credentials': true,
	        },
	    };
	    callback(null, response);
	}).catch((err) => {
		callback(err);
	});
};

module.exports = {hello}