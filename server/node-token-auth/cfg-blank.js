var secret = 'some phrase to be used to encode token';
var port = 3000;
var db= 'test';

exports.cfg = function(){
	return{
		secret:secret,
		port: port
	}
}

exports.gmail= function() {
	return {
		service: 'Gmail',
		auth: {
		    user: "mckenna.tim@gmail.com",
		    pass: "xxxxxxxxx" 
      	}		
	}
}

exports.db = function(){
	return{
		url: 'mongodb://localhost/'+db,
		db: db		
	}
}