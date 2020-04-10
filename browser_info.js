const puppeteer = require('puppeteer');

module.exports = async function(){
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true, devtools : true});
	  	const page = await browser.newPage();

	  		await page.goto('http://jti.polije.ac.id/elearning/login/index.php')
	  		.then(function(){
	  			try{
	  				 page.evaluate(function(){
	  						$(document).ready(function(){
	  							$('input[name ="username"]').val("E41180700");
	  							$('input[name ="password"]').val("jtipolije");
	  							$(document).ready(function(){
	  								$('#loginbtn').click();
	  							});
	  						});
	  					});
	  				 //Puppeeteer anjincc
	  				 
	  			}catch(err){
	  				// page.close();
	  				return page;
	  			}
	  })
	  await page.waitForNavigation({waitUntil : 'load'});

	  return browser;
}

