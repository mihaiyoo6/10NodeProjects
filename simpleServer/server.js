'use strict';
const http = require( 'http' ),
	url = require( 'url' ),
	path = require( 'path' ),
	fs = require( 'fs' );

let mainTypes = {
	html: 'text/html',
	jpeg: 'jpeg',
	jpg: 'jpg',
	png: 'png',
	js: 'text/javascript',
	css: 'text/css'
};

//create server
http.createServer( ( req, res ) => {
	let uri = url.parse( req.url ).pathname,
	fileName = path.join( process.cwd(), unescape( uri ) ),
	stats;
console.log( 'Loaging... ',uri );
	try{
		stats = fs.lstatSync( fileName );
	}catch( e ) {
		res.writeHead(404, {'Content-type': 'text/plain'} );
		res.write('404 Not Found \n');
		res.end();
		return;
	}

	//check if file or directory
	if( stats.isFile() ){
		let mainType = mainTypes[ path.extname( fileName).split('.').reverse()[ 0 ] ];
		res.writeHead(200, {'Content-type': mainType } );

		let fileStream = fs.createReadStream( fileName );
		fileStream.pipe( res );
	} else if(stats.isDirectory()){
		res.writeHead(302, {
			'Localtion': 'index.html'
		} );
		res.end();
	}else{
		res.writeHead(500, {'Content-type': 'text/plain'} );
		res.write( '500 Internal error!' );
		res.end();
	}
} ).listen( 3000 );