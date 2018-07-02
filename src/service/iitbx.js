/*
Added by Tanmoy Ghosh (tantrojan)
*/
const request =require("request");
const http = require("http");
var FormData = require('form-data');


var domain = '10.196.0.56';
var port = 8000;
var basePath = '/files/info/';

var storageUrl = ' http://' + domain + ':' + port.toString() + basePath;

var fs = require('fs');
var path = require('path');

module.exports = {
	
	getCoursesAPI : function(req,res){
		
		console.log(storageUrl +"\n");
		var requestParameter = {
			uri: storageUrl,
			method: "GET",
			headers : {
				'content-type' : 'application/json'
				// 'data-type'	: 'image/png'
			}
		}

		var matrix={};
		request(requestParameter, function(error, response, body) {
			var containers = (JSON.parse(response.body)).split("\n");
			containers=containers.slice(0,-1);
			console.log(containers);
			for(var i=0;i<containers.length;i++)
			{

				matrix[i]=containers[i];
			}
			res.send(containers);
		});
	},

	getObjectsAPI : function(req,res){
		
		// Request for fetching object list
		var requestParameter = {
			uri: storageUrl + req.params['course_name'],
			method: "GET",
			headers : {
				'content-type' : 'application/json'
			}
		}

		var flag=0;
		var matrix={};
		var details = "";
		request(requestParameter, function(error, response, body) {

			console.log(response.body)
			var objects = (JSON.parse(response.body)).split("\n");
			objects=objects.slice(0,-1);
			// console.log(objects);

			var objects = (JSON.parse(response.body)).split("\n");
			objects=objects.slice(0,-1);
			// console.log(objects);
			for(var i=0;i<objects.length;i++)
			{  	
				matrix[i]=objects[i];
			}
			if(i==objects.length)
			{
				// Request for fetching course details
				var requestParameter = {
					uri: storageUrl + req.params['course_name'] +"/metadata" ,
					method: "GET",
					headers : {
						'content-type' : 'application/json'
					}
				}

				request(requestParameter,function(error,response,body){
					var metadata = JSON.parse(response.body);
					details = metadata['X-Container-Meta-Detail'];
					flag++;
					console.log(flag);
					if(details==null)
					{
						details="No Description";
					}
					var result = {
						'description' :details,
						'objects' : matrix
					}
					console.log("sent")
					res.send((result));

				})
			}

		});
	},

	getParticularObjectAPI :function(req,res){

		var options = {
			method: 'GET',
			host: domain,
			port: port,
			path: basePath + req.params['course_name'] +'/' + req.params['obj_name']+"/download",
			// encoding : null
		};

		var request = http.request(options, function(response) {
			var data = [];

			response.on('data', function(chunk) {
				data.push(chunk);
			});

			response.on('end', function() {
				data = Buffer.concat(data);
				res.writeHead(200, {
					'Content-Type': response.headers['content-type'],
					'content-disposition' : 'inline',
					'Content-Length': data.length
				});
				res.end(data);
			});
		});

		request.end();
		
	},

	deleteParticularObjectAPI : function(req,res){
		var requestParameter = {
			uri: storageUrl + req.params['course_name']+ "/" + req.params['obj_name'],
			method: "DELETE",
			headers : {
				'content-type' : 'application/json'
			}
		}

		request(requestParameter, function(error, response, body) {
			res.send(req.params['obj_name'] + " Deleted")
		});

	},

	createCourseAPI : function(req,res){

		var input_files = req.files;
		var input_body = req.body;

		console.log(input_files);
		console.log(input_body);
		// res.send('OK')
		var course_name = input_body['title'];
		var details = input_body['description'].trim();
		// Creating Container
		console.log("Making new cont");
		var options = {
			uri: storageUrl,
			method: "PUT",
			headers : {
				'content-type' : 'application/json'
			},
			body: JSON.stringify({'name' : course_name})
		}

		request(options, function(err2,res2,body2){
			console.log("Container created ");
			for(var i=0;i<input_files.length;i++)
			{

				fileName = input_files[i].filename;
				mimeType = input_files[i].mimetype;
				console.log(mimeType)
				console.log(fileName);

				var form = new FormData();
				form.append('file',fs.createReadStream(path.join(__dirname,'/uploads/'+fileName)),null);
				form.submit(storageUrl + course_name + '/upload' , function(err, res) {
					if(err)
					{
						console.log("Error :" + err);
					}
					// console.log(res);
				});
			}
			if(i==input_files.length)
			{
				//Uploading metadata
				var requestParameter = {
					uri: storageUrl + course_name,
					method: "POST",
					headers : {
						'content-type' : 'application/json'
					},
					body : JSON.stringify({"X-Container-Meta-Detail": details})
				}

				request(requestParameter,function(error,response,body){
					res.send('All files uploaded, and details added in metadata of the container');
				})
			}

		});
	},

	deleteCourseAPI : function(req,res){

		var requestParameter = {
			uri: storageUrl + req.params['course_name'],
			method: "DELETE",
			headers : {
				'content-type' : 'application/json'
			}
		}

		request(requestParameter, function(error, response, body) {
			res.send("ontainer Deleted");
		});
	}


}
