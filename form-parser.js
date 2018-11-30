const Busboy = require('busboy');
const inspect = require('util').inspect;
const getContentType = (event) => {
    let contentType = event.headers['content-type']
    if (!contentType){
    	return event.headers['Content-Type'];
    }
    return contentType;
};

const parser = async (event) => new Promise((resolve, reject) => {
    const busboy = new Busboy({
        headers: {
            'content-type': getContentType(event),
        }
    });

    const result = {};

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      result[fieldname] = val
    });
    busboy.on('finish', function() {
        console.log('Done parsing form!');
        resolve(result);
    });
    console.log('event.isBase64Encoded')
    console.log(event.isBase64Encoded)
    busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
    busboy.end();
});

module.exports.parse = parser;