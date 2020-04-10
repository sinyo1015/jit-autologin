const puppeteer = require('puppeteer');
const cookieReader = require('./cookies.js');
const forHelper = require('./foreach_helper.js');
const serverHelper = require('./server.js');





module.exports = async function(browser){


	const datas = cookieReader.getData();

	for(var i = 0; i < datas.data.length; i++){
		const incog = await browser.createIncognitoBrowserContext();
		const pagePrimary = await incog.newPage();
			var firstData = datas.data[i];
			await pagePrimary.goto('http://jti.polije.ac.id/elearning/login/index.php').then(async function(res){
				try{
		  				 pagePrimary.evaluate(firstData => {
		  						$(document).ready(function(){
		  							$('input[name ="username"]').val(firstData.u);
		  							$('input[name ="password"]').val(firstData.p);
		  							$(document).ready(function(){
		  								$('#loginbtn').click();
		  							});
		  						});
		  					}, firstData);
		  				 //Puppeeteer anjincc
		  				 
		  			}catch(err){
		  				// page.close();
		  				return err.message;
		  			}
		  			await pagePrimary.waitForNavigation({waitUntil : 'load'});

		  			let logout = await pagePrimary.evaluate(function(){
		  				function urlParamsGet (url, name) {
		  				    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
		  				                      .exec(url);

		  				    return (results !== null) ? results[1] || 0 : false;
		  				}
		  				var aUrls = $('.dropdown-menu.usermen').children().last().find('a').attr('href');
		  				return urlParamsGet(aUrls, 'sesskey');
		  			});

		  			await pagePrimary._client.send('Network.getCookies').then(function(result){
		  				result.cookies.forEach(function(i, e){
		  					if(i.name === 'MoodleSession'){
		  						cookieReader.setCookies(firstData.name, i, logout);
		  						serverHelper.msg({data : "Cookie & Session untuk : "+firstData.name+" telah diperbarui\n"});
		  					}
		  				});
		  			});
			});




			await pagePrimary.close().then();
	}

	return "\n\nabsen.json / token autologin telah terdaftar, valid untuk 6-12 jam. silahkan mengupdate jika ingin autologin";


	// datas.data.forEach(async function(i){
	// 	await incog.newPage();
	// 	await pagePrimary.goto('http://jti.polije.ac.id/elearning/login/index.php').then(async function(res){
	// 		try{
	//   				 pagePrimary.evaluate(i => {
	//   						$(document).ready(function(){
	//   							$('input[name ="username"]').val(i.u);
	//   							$('input[name ="password"]').val(i.p);
	//   							$(document).ready(function(){
	//   								$('#loginbtn').click();
	//   							});
	//   						});
	//   					}, i);
	//   				 //Puppeeteer anjincc
	  				 
	//   			}catch(err){
	//   				// page.close();
	//   				return err.message;
	//   			}
	//   			await pagePrimary.waitForNavigation({waitUntil : 'load'});


	//   			await pagePrimary._client.send('Network.getCookies').then(function(result){
	//   				result.cookies.forEach(function(i, e){
	//   					if(i.name === 'MoodleSession'){
	//   						console.log("Founded MoodleSession");
	//   					}
	//   				});
	//   			});

	// 	});
	// 	await console.log(i.u);
	// });

	// forHelper.asyncForEach(datas.data, async (i) => {
	// 		await incog.newPage();
	// 		await pagePrimary.goto('http://jti.polije.ac.id/elearning/login/index.php').then(async function(res){
	// 			try{
	// 	  				 pagePrimary.evaluate(i => {
	// 	  						$(document).ready(function(){
	// 	  							$('input[name ="username"]').val(i.u);
	// 	  							$('input[name ="password"]').val(i.p);
	// 	  							$(document).ready(function(){
	// 	  								$('#loginbtn').click();
	// 	  							});
	// 	  						});
	// 	  					}, i);
	// 	  				 //Puppeeteer anjincc
		  				 
	// 	  			}catch(err){
	// 	  				// page.close();
	// 	  				return err.message;
	// 	  			}
	// 	  			await pagePrimary.waitForNavigation({waitUntil : 'load'});


	// 	  			await pagePrimary._client.send('Network.getCookies').then(function(result){
	// 	  				result.cookies.forEach(function(i, e){
	// 	  					if(i.name === 'MoodleSession'){
	// 	  						console.log("Founded MoodleSession");
	// 	  					}
	// 	  				});
	// 	  			});

	// 		});
	// 		await console.log(i.u);
	// });

}
