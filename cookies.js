

const fs = require('fs');
const jQuery = require('jquery');
const noop = () => {};



var self = {

	//let nama = name;

	getData : function(){
		let rawdata = fs.readFileSync('./absen.json');
		return JSON.parse(rawdata);	
	},


	getCookies :function(name){
		var absen = self.getData();
		var result;
		absen.data.forEach((item) => {
			if(item.name === name){
				result = item.cookies;
			}
		});
		return result;
	},

	setCookies : function(name, cookies, sessionKey){
		var absen = self.getData();

		absen.data.forEach((item) => {
			if(item.name === name){
				item.cookies = cookies;
				item.session = sessionKey;
			}
		});	
		fs.writeFile('./absen.json', JSON.stringify(absen), function(err){
			if(err) {
			    return console.log(err);
			}
			//console.log("absen.json Terbarui");
		});
	}

	//console.log(JSON.stringify(absen));

	
}

module.exports = self;

	