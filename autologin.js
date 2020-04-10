const puppeteer = require('puppeteer');
const cookieReader = require('./cookies.js');
const serverHelper = require('./server.js');

function urlParamsGet (url, name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(url);

    return (results !== null) ? results[1] || 0 : false;
}

var loginCountToday = 0;

module.exports = async function(browser){
		const incog = await browser.createIncognitoBrowserContext();
	  	const page = await incog.newPage();
	  	var results = "";
	  	const datas = cookieReader.getData();
	  	await page.goto('http://jti.polije.ac.id/elearning/login/index.php');


	  	try{
	  	for(var t = 0; t < datas.data.length; t++){
	  		var dataC = datas.data[t];
	  		console.log(dataC.cookies);
	  			await page.setCookie(dataC.cookies);
	  			await page.goto('http://jti.polije.ac.id/elearning/calendar/view.php').then(async function(results){
	  				let hasilLink = await page.evaluate(function(){
	  					var oLink = [];
	  					$('.card').each(function(i, e){
	  					    let y = $(this);
	  					    let u = $(this).find('.date.pull-xs-right.m-r-1').find('a:contains("Today")');
	  					    if(u.length > 0){
	  					        var xImg = y.find('img[alt="Activity event"]');
	  					        if(xImg.length > 0){
	  					            oLink.push(y.find('.description.card-block.calendar_event_attendance').find('a:contains("Go to activity")').prop('href'));
	  					        }
	  					    }
	  					});
	  					return oLink;
	  				});
	  				if(hasilLink.length <= 0){
	  					await page.screenshot({
	  								path: "./screenshot/screenshot.jpg",
	  								type: "jpeg",
	  								fullPage: true
	  							}).then(function(results){
	  								serverHelper.sendImage({data : "Tidak ada absensi hari ini "});
	  							});
	  					return;
	  				}
	  				for(var k = 0; k < hasilLink.length; k++){
	  					const newPg = await incog.newPage();
	  					await newPg.goto(hasilLink[0]).then(async function(results){
	  						let linkGrabber = await newPg.evaluate(function(){
	  							var t = $('.generaltable.attwidth.boxaligncenter').find('td.cell:last-child').find('a:contains("Submit attendance")');
	  							if(t.length > 0){
	  								return t.prop('href');
	  							}else{
	  								return null;
	  							}
	  						});

	  						if(linkGrabber == null){
	  							await newPg.screenshot({
	  								path: "./screenshot/screenshot.jpg",
	  								type: "jpeg",
	  								fullPage: true
	  							}).then(function(results){
	  								serverHelper.sendImage({data : "Dirimu sudah absen :v, dear "+dataC.name});
	  							});
	  							return;
	  						}

	  						await axios.post('http://jti.polije.ac.id/elearning/mod/attendance/attendance.php',{
	  							sessid : urlParamsGet(linkGrabber, 'sessid'),
	  							sesskey : urlParamsGet(linkGrabber, 'sesskey'),
	  							status : 1587,
	  							_qf__mod_attendance_student_attendance_form : 1,
	  							mform_isexpanded_id_session : 1
	  						}, {
	  							'User-Agent' : 'EuyRuntime/9.0.9',
	  							'Accept' : '*/*',
	  							'Accept-Encoding' : 'gzip, deflate, br',
	  							'Connection' : 'keep-alive'
	  						}).then(async function(response){
	  							await newPg.goto(hasilLink).then(async function(results){
	  								await newPg.screenshot({
	  									path: "./screenshot/screenshot.jpg",
	  									type: "jpeg",
	  									fullPage: true
	  								}).then(function(results){
	  									serverHelper.sendImage({data : dataC.name});
	  								});
	  							});
	  						}).catch(function(er){
	  							serverHelper.msg("Error pada autologin , "+err.message);
	  						});
	  					});
	  					await newPg.close();
	  				}
	  			});
	  		}
	  	}catch(err){
	  			serverHelper.msg("Error pada autologin 2");
	  		}

}