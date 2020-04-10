const puppeteer = require('puppeteer');

module.exports = async function(browser){
	try{
		var page = await browser.newPage();
		await page.goto('http://jti.polije.ac.id/elearning/calendar/view.php');  
		let msg = await page.evaluate(function(){
		   let msg = "*Jadwal untuk hari ini :* \n\n";
		   let num = 1;
		   $('.card').each(function(i, e){
		      msg += "======= Subjek "+num+" ========\n";
		      msg += "📚 Subjek : " + $(this).find('.name').text() + "\n";
		      msg += "🕒 Hingga : " + $(this).find('.date').text() + "\n";
		      msg += "===== End Subjek "+num+" ======\n\n\n";
		      num++;
		   });
		   return msg;
		});
		return msg;
	}catch(err){
		console.log("error di 2 : " + err.message);
		return null;
	}finally{
		try{
			await page.close();
		}catch(err){

		}
	}
}
