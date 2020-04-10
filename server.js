// Supports ES6
// import { create, Whatsapp } from 'sulla';


const puppeteer = require('puppeteer');
const sulla = require('sulla');


//const browser = require('./browser.js');
const jadwal = require('./jadwal.js');
const cookies = require('./cookies.js');
const jadwal_info = require('./jadwal_info.js');
const browser_info = require('./browser_info.js');
const login_collector = require('./login_init.js');
const EventEmitter = require('events');
const autologin = require('./autologin.js');
const fs = require('fs');
const express = require('express');
const path = require('path');
// let cookie = cookies.setCookies('Dika', {Expile : "wow"});
// console.log(cookie);


const myEmitter = new EventEmitter();



var appDir = path.dirname(require.main.filename);

var clientS, messageS;

var app = express();

// module.exports = function(msg){
// 	myEmitter.emit('event', msg);
// }


var bantuan = "*Daftar Menu Bot*\n"+
				"_Bisa digunakan dalam huruf besar kecil / mixed\n\n"+
				"🙋‍♀️ halo\n"+
				"Digunakan untuk bot menyapa anda 😄\n\n"+
				"🗓️ jadwal\n"+
				"Mendapatkan akses jadwal terkini\n\n"+
				"✍️ autoregister\n"+
				"Digunakan untuk pendaftaran autologin mendatang, harus dilakukan dalam jangka waktu 6-12(4 - 2 kali sehari), _yamaap, devnya masih belum bisa apa2 hehe 😬_\n\n\n"+
				"Build using Node.js & Maintained by @Sinyo";



var __result = () => {};

var __openedBrowser = browser_info();
var browserItself; 

var isMustWaiting = false;


// Writes QR in specified path
function exportQR(qrCode, path) {
  qrCode = qrCode.replace('data:image/png;base64,', '');
  const imageBuffer = Buffer.from(qrCode, 'base64');

  // Creates 'marketing-qr.png' file
  fs.writeFileSync(path, imageBuffer);
}



function sendMessage(client, message){
	messageS = message;
	if(isMustWaiting == true){
		client.sendText(message.from, "Tunggu operasi sebelumnya selesai yaa, jangan keburu2 😄");
	}else{
		switch(message.body.toLowerCase()){
			case 'halo':
			client.sendText(message.from, "Halo Juga 😄");
			return;

			case 'jadwal':
			client.sendText(message.from, "Sedang mengambil Jadwal...");
			jadwal_info(browserItself).then(function(result){
				client.sendText(message.from, result);
			});
			return;

			case 'autoregister':
			isMustWaiting = true;
			login_collector(browserItself).then(function(result){
				client.sendText(message.from, result).then(function(result){
					isMustWaiting = false;
				});
			});
			return;

			case 'autologin':
			autologin(browserItself);
			return;


			case 'bantuan':
			client.sendText(message.from, bantuan);
			return;
		}
	}
}


app.listen(3000, function(){
	console.log(appDir);
	console.log("Express.js server is running");
	myEmitter.on('event', function firstListener(param) {
	  clientS.sendText(messageS.from, param.data);
	});

	myEmitter.on('sendImg', function secondListener(param){
		clientS.sendImage(messageS.from, appDir+"/screenshot/screenshot.jpg", 'screenshot.jpg', param.data);
	});

	__openedBrowser.then(async function(result){
		browserItself = result;	
	});


	sulla.create('xbyAAHhNNmaKQKA', (base64Qr, asciiQR)=>{
		exportQR(base64Qr, './enc.png');
	}).then((client) => start(client));

	async function start(client) {
		clientS = client;

	  client.onMessage((message) => {

	  	sendMessage(client, message);

	  });
	  client.onStateChange((state) => {
	    if (state === 'UNLAUNCHED') {
	      client.useHere();
	    }
	  });
	}
});










//browser('jadwal').then(result => getJadwal(result).then(result => console.log(result)));










exports.msg = function(msg){
	myEmitter.emit('event', msg);
}



exports.sendImage = function(msg){
	myEmitter.emit('sendImg', msg);
}
