var path = require('path');
var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // modified here  or user file.mimetype
  }
});

var upload = multer({ storage: storage });
var type = upload.single('fileInput');
app.use(express.static(path.join(__dirname, 'public')));
var items;
var page;
var fs = require('fs');

items = fs.readFileSync("data.json", "utf8");

//console.log(items);
var itemsParsed = JSON.parse(items);
//console.log(itemsParsed);
fs.readFile("index.html", "utf8", 
            function(error,data){
                if(error) throw error; // если возникла ошибка
            	page = data;
});

app.get('/', function (req, res) {
  res.send(page);
});
app.post('/', function (req, res) {
	//console.log("post");
  res.json(items);
});

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */


 function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;

}



app.use(bodyParser.json());
/*app.post("/addmessage", urlencodedParser, function (request, response) {
	if(!request.body) return response.sendStatus(400);
	var data;

	data = fs.readFileSync("data.json", "utf8");
	data = JSON.parse(data);
	post = {
		id : data[data.length-1].id + 1,
		time : getDateTime(),
		message : request.body.message
	}
	console.log(request);
	//data.push(post);
	fs.writeFileSync("data.json", JSON.stringify(data, "", 4));
	response.send("");
	//console.log("addmessage");
});
*/

app.post('/addmsg', upload.single('fileInput'), (req, res) => {
  let formData = req.body;
  var data;

	data = fs.readFileSync("data.json", "utf8");
	data = JSON.parse(data);
	var format = "";
	
	
	if(req.file){
		if(req.file.originalname == "jpeg" || req.file.originalname == "png"){
		format = req.file.originalname;
		}
		if(format){
			post = {
			id : data[data.length-1].id + 1,
			time : getDateTime(),
			message : formData.message,
			image : "img/" + (data[data.length-1].id + 1) + '.' + format
		}
	}
	fs.rename('./public/img/' + req.file.originalname, './public/img/' + post.id + '.' + format, function(err) {
    if ( err ) console.log('ERROR: ' + err);
	});
	}else {
		post = {
		id : data[data.length-1].id + 1,
		time : getDateTime(),
		message : formData.message,
		image : ""
	}
		//console.log("no file");
	}
	data.push(post);
	fs.writeFileSync("data.json", JSON.stringify(data, "", 4));
  res.sendStatus(200);
});


app.get('/messages', function (req, res) {
	var messages;
	messages = fs.readFileSync("data.json", "utf8");
	res.send(JSON.parse(messages));
	//console.log(JSON.parse(messages).length);
	//console.log("messages");
	//console.log(getDateTime());
});
/*app.post("/deletemessage", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    var data;
	data = fs.readFileSync("data.json", "utf8");
	data = JSON.parse(data);
	data.forEach(function(item, i, arr) {
		if(item.content === request.body.username){
			item.intervals.forEach(function(itemI, j, arrr) {
				if(itemI.start === request.body.interval.start && itemI.end === request.body.interval.end) {
					data[i].intervals.splice(j, 1);
				}
			});
		}
            
          });
	fs.writeFileSync("data.json", JSON.stringify(data, "", 4));
	response.send("");
});*/



app.listen(process.env.PORT || 8080, function(){
  //console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
