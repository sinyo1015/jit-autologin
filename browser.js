const puppeteer = require('puppeteer');
const serverHelper = require('./server.js');

module.exports = async function(browser){
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: false, devtools : true});
		const incog = await browser.createIncognitoBrowserContext();
	  	const page = await incog.newPage();

	  	try{
	  			await page.goto('http://jti.polije.ac.id/elearning/login/index.php')
	  			.then(function(){
	   				page.evaluate(function(){
				  		$(document).ready(function(){
				  			$('input[name ="username"]').val("E41180700");
				  			$('input[name ="password"]').val("jtipolije");
				  			$(document).ready(function(){
				  				$('#loginbtn').click();
				  			});
				  		});
	  				});
	  			});	
	  	}catch(err){
	  		browser.close();
	  		return null;
	  	}

	  //Puppeeteer anjincc
	  await page.waitForNavigation({waitUntil : 'load'});
	  return page;
}

