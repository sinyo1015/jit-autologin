const puppeteer = require('puppeteer');
const shell = require('shelljs');

var browser = null;

var self = {

	setBrowser : async function(closeBrowser){
		if(closeBrowser === true){
			browser.close();
			return;
		}
		browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: false, devtools : true});
		return browser;
	},

	closePage : async function(){
		shell.exec('pkill chrome');
	}
}

module.exports = self;