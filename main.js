if (require('electron-squirrel-startup')) return;
// Don't launch if squirrel is updating us


// Modules to control application life and create native browser window
const electron = require("electron");
const { app, BrowserWindow, ipcMain, session, systemPreferences, Menu, dialog } = require('electron');

const log = require('electron-log');

const { autoUpdater } = require("electron-updater");

const serve = require('electron-serve');

const devBuildExpiration = {year:2019,month:4,day:21} // months start at 0 for whatever reason, so number is essentially added by 1

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDev = true;


const loadURL = serve({scheme:"moderndeck",directory:'ModernDeck'});

app.setAppUserModelId("com.dangeredwolf.ModernDeck");


var updating = false;
var installLater = false;
var showWarning = false;

autoUpdater.setFeedURL({
	"owner": "dangeredwolf",
	"repo": "ModernDeckAPPTEST",
	"provider": "github"
});

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

var checkDevDate = new Date();



function makeLoginWindow(url) {

	var originalUrl = url;

	var loginWindow = new BrowserWindow({
		width: 710,
		height: 490,
		webPreferences: {
			nodeIntegration: true
		},
		scrollBounce:true,
		autoHideMenuBar:true,
		icon:__dirname+"ModernDeck/sources/favicon.ico",
	});

	loginWindow.on('closed', function() {
		loginWindow = null;
	});

	loginWindow.webContents.on("will-navigate", function(event, url) {
		console.log(url);
		const { shell } = electron;
		if (url.indexOf("https://tweetdeck.twitter.com") >= 0) {
			mainWindow.loadURL(url);
			loginWindow.close();
			event.preventDefault();
			return;
		}
		if (url.indexOf("https://twitter.com/?logout") >= 0) {
			mainWindow.reload();
			loginWindow.close();
			event.preventDefault();
			return;
		}
		if (url.indexOf("https://twitter.com/logout") >= 0 || url.indexOf("https://twitter.com/login") >= 0) {
			return;
		}
		if (url.indexOf("https://twitter.com/account") >= 0 || url.indexOf("https://twitter.com/signup") >= 0) {
			shell.openExternal(url);
			event.preventDefault();
			return;
		}

		event.preventDefault();
	});

	loginWindow.webContents.on("did-navigate-in-page", function(event, url) {
		console.log(url);
		if (url.indexOf("https://tweetdeck.twitter.com") >= 0) {
			mainWindow.loadURL(url);
			loginWindow.close();
			event.preventDefault();
			return;
		}
		if (url.indexOf("https://twitter.com/logout") >= 0 || url.indexOf("https://twitter.com/login") >= 0) {
			return;
		}
		loginWindow.loadURL(originalUrl);
	});

	loginWindow.loadURL(url);

}

function makeWindow() {


	var display = {};


	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		},
		scrollBounce:true,
		autoHideMenuBar:true,
		title:"ModernDeck",
		icon:__dirname+"ModernDeck/sources/favicon.ico",
		frame:false,
		minWidth:400,
		show:false,
		backgroundColor:'#263238'
	});

	console.log("\n")
	console.log(checkDevDate.getFullYear() + " vs " + devBuildExpiration.year);
	console.log(checkDevDate.getMonth() + " vs " + devBuildExpiration.month);
	console.log(checkDevDate.getDate() + " vs " + devBuildExpiration.day);

	if ((!!devBuildExpiration.year && (!!devBuildExpiration.month || devBuildExpiration.month === 0) && !!devBuildExpiration.day) &&
		checkDevDate.getFullYear() > devBuildExpiration.year ||
		(checkDevDate.getMonth() > devBuildExpiration.month && checkDevDate.getFullYear() === devBuildExpiration.year) ||
		(checkDevDate.getDate() >= devBuildExpiration.day && checkDevDate.getMonth() === devBuildExpiration.month && checkDevDate.getFullYear() === devBuildExpiration.year)) {
		dialog.showMessageBox(mainWindow,{
			title:"ModernDeck",
			message:"This development build of ModernDeck has expired. It expired on " + devBuildExpiration.year + "/" + (devBuildExpiration.month<9?"0"+(devBuildExpiration.month+1) : devBuildExpiration.month+1) + "/" + devBuildExpiration.day + ".\n\nPlease uninstall this version of ModernDeck from Programs and Features.",
			type:"error",
			buttons:["Upgrade to latest test build","Close"]
		},function(response){
			const { shell } = electron;
			if (response === 0) {
				shell.openExternal("https://github.com/dangeredwolf/ModernDeckAPPTEST/releases");
			}
			app.quit();
		});
		return;
	}


	var isOnline = true;

	// var online = mainWindow.webContents.executeJavaScript("return typeof TD !== \"undefined\"",false,function(e){
	// 	isOnline = e;
	// })

	mainWindow.show();


	mainWindow.on('page-title-updated', function(event,url) {
		event.preventDefault();
	})


	mainWindow.webContents.on('dom-ready', function(event, url) {
		mainWindow.webContents.executeJavaScript('\
			document.querySelector("html").classList.add("mtd-app");\
			var injurl = document.createElement("div");\
			injurl.setAttribute("type","moderndeck://ModernDeck/");\
			injurl.id = "MTDURLExchange";\
			document.head.appendChild(injurl);\
			\
			var InjectScript2 = document.createElement("script");\
			InjectScript2.src = "https://cdn.ravenjs.com/3.19.1/raven.min.js";\
			InjectScript2.type = "text/javascript";\
			document.head.appendChild(InjectScript2);\
			\
			var injStyles = document.createElement("link");\
			injStyles.rel = "stylesheet";\
			injStyles.href = "moderndeck://ModernDeck/sources/moderndeck.css";\
			document.head.appendChild(injStyles);\
			\
			var InjectScript = document.createElement("script");\
			InjectScript.src = "moderndeck://ModernDeck/sources/MTDinject.js";\
			InjectScript.type = "text/javascript";\
			document.head.appendChild(InjectScript);\
			');
	});

	mainWindow.webContents.on('did-fail-load', (event, code, desc) => {
		var msg = "ModernDeck failed to start.\n\n";

		console.log(desc);

		if (code === -3 || code === -11 || code === -2 || code === -1) {
			return;
		}

		var addChromiumErrorCode = false;

		if (code === -13 || code === -12) {
			msg += "Your PC ran out of memory trying to start ModernDeck. Try closing some programs or restarting your PC and trying again."
		} else if ((code <= -800 && code >= -900) || code === -137 || code === -105) {
			msg += "We can't connect to Twitter due to a DNS error.\nPlease check your internet connection.";
			addChromiumErrorCode = true;
		} else if (code === -201) {
			msg += "Please check that your PC's date and time are set correctly. Twitter presented us with a security certificate that either expired or not yet valid.\nIf your date and time are correct, check https://api.twitterstat.us to see if there are any problems at Twitter."
		} else if (code === -130 || code === -131 || code === -111 || code === -127 || code === -115 || code === -336) {
			msg += "We can't connect to your internet connection's proxy server.\n\nIf you don't need to connect to a proxy server, you can take the following steps on Windows:\n1. Press Windows Key + R to open the Run dialog.\n2. Enter inetcpl.cpl\n3. Go to the Connections tab\n4. Click the LAN settings button near the bottom\n5. Uncheck \"Use a proxy server for your LAN\""
			addChromiumErrorCode = true;
		} else if (code === -22) {
			msg += "Your domain administrator has blocked access to tweetdeck.twitter.com.\nIf your device is owned by an organization, you might need to ask a network administrator to unblock it.\nIf you are not logged in as part of a domain, you may need to configure your Local Group Policy settings."
		} else if (code === -7 || code === -118) {
			msg += "We can't connect to Twitter because the request timed out.\nPlease check your internet connection.\nIf it still doesn't work, check https://api.twitterstat.us to see if there are any problems at Twitter."
		} else if (code === -29 || code === -107 || (code <= -110 && code >= -117) || code === -123 || (code <= -125 && code >= -129) || code === -134 || code === -135 || code === -141 || (code <= -148 && code >= -153) || code === -156 || code === -159 || code === -164 || code === -167 || code === -172 || code === -175 || (code <= -177 && code >= -181) || (code <= -501 && code >= -504)) {
			msg += "We can't establish a secure connection to Twitter.\nThis may be caused by network interference or a problem at Twitter.\n\nIf it still doesn't work, but other HTTPS websites appear to load (such as google.com), check https://api.twitterstat.us to see if there are any problems at Twitter.";
			addChromiumErrorCode = true;
		} else if (code <= -200 && code >= -220) {
			msg += "We can't establish a secure connection to Twitter.\nThere is a problem with the digital certificate that was presented to us by Twitter.\n\nPlease try again, or if it persists, check https://api.twitterstat.us to see if there are any problems at Twitter.";
			addChromiumErrorCode = true;
		} else if (code <= -1 && code >= -99) {
			msg += "We can't connect to Twitter due to an unexpected system error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else if (code <= -100 && code >= -199) {
			msg += "We can't connect to Twitter due to an unexpected connection error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else if (code <= -200 && code >= -299) {
			msg += "We can't connect to Twitter due to an unexpected certificate error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else if (code <= -300 && code >= -399) {
			msg += "We can't connect to Twitter due to an unexpected protocol error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else if (code <= -400 && code >= -499) {
			msg += "We can't connect to Twitter due to an unexpected caching error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else {
			msg += "We can't connect to Twitter due to an unexpected error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		}

		if (addChromiumErrorCode) {
			msg += "\n\n" + desc + " " + code
		}


		console.log(code);
		dialog.showMessageBox(mainWindow,{
			title:"ModernDeck",
			message:msg,
			type:"error",
			buttons:["Retry","Close"]
		},function(response){
			if (response === 0) {
				mainWindow.reload();
			} else if (response === 1) {
				mainWindow.close();
			}
		});
		return;
	});

	mainWindow.webContents.session.webRequest.onHeadersReceived(
		{urls:["https://tweetdeck.twitter.com/*","https://twitter.com/i/cards/*"]},
		(details, callback) => {
			var foo = details.responseHeaders;
			foo["content-security-policy"] =[
				"default-src 'self'; connect-src * moderndeck:; font-src https: data: * moderndeck:; frame-src https: moderndeck:; frame-ancestors 'self' https: moderndeck:; img-src https: data: moderndeck:; media-src * moderndeck:; object-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sentry.io https://cdn.jsdelivr.net https://ajax.googleapis.com moderndeck: https://cdn.ravenjs.com/ https://*.twitter.com https://*.twimg.com https://rawgit.com https://*.rawgit.com https://ssl.google-analytics.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' https: moderndeck:;"];
			callback({ responseHeaders: foo});
		}
	);

	mainWindow.webContents.session.webRequest.onBeforeRequest({urls:["https://ton.twimg.com/*"]},function(details,callback) {

		if (details.url.indexOf(".css") > -1 && (details.url.indexOf("bundle") > -1 && details.url.indexOf("dist") > -1)) {
			callback({cancel:true});
			return;
		}

		callback({cancel:false});
	});

	mainWindow.loadURL("https://tweetdeck.twitter.com");

	mainWindow.webContents.on("will-navigate", function(event, url) {
		const { shell } = electron;
		if (url.indexOf("https://tweetdeck.twitter.com") < 0) {
			event.preventDefault();
			console.log(url);
			if (url.indexOf("https://twitter.com/login") >= 0 || url.indexOf("https://twitter.com/logout") >= 0) {
				makeLoginWindow(url);
			} else {
				shell.openExternal(url);
			}
		}
	});

	mainWindow.webContents.on("new-window", function(event, url) {
		const { shell } = electron;
		event.preventDefault();
		shell.openExternal(url);
	});

	mainWindow.webContents.on("context-menu", function(event, params) {
		mainWindow.send("context-menu", params);
	});

	ipcMain.on("copy",function(event){
		mainWindow.webContents.copy();
	});
	ipcMain.on("cut",function(event){
		mainWindow.webContents.cut();
	});
	ipcMain.on("paste",function(event){
		mainWindow.webContents.paste();
	});
	ipcMain.on("delete",function(event){
		mainWindow.webContents.delete();
	});
	ipcMain.on("selectAll",function(event){
		mainWindow.webContents.selectAll();
	});
	ipcMain.on("undo",function(event){
		mainWindow.webContents.undo();
	});
	ipcMain.on("redo",function(event){
		mainWindow.webContents.redo();
	});
	ipcMain.on("copyImage",function(event,arg){
		mainWindow.webContents.copyImageAt(arg.x,arg.y);
	});
	ipcMain.on("inspectElement",function(event,arg){
		mainWindow.webContents.inspectElement(arg.x,arg.y);
	});
	ipcMain.on("restartApp",function(event,arg){
	});

	mainWindow.on('closed', function() {
		mainWindow = null;
	});

	mainWindow.on('maximize', function() {
		mainWindow.webContents.executeJavaScript('\
			document.querySelector("html").classList.add("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3E0";\
			');
	});

	mainWindow.on('unmaximize', function() {
		mainWindow.webContents.executeJavaScript('\
			document.querySelector("html").classList.remove("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3C6";\
			');
	});
}

app.on('ready', makeWindow)

app.on('window-all-closed', function() {
	app.quit();
})

app.on('activate', function() {
	if (mainWindow === null)
		makeWindow();
})


autoUpdater.on("error",function(e,f,g){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("error",e,f,g);
});

autoUpdater.on("checking-for-update",function(e){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("checking-for-update",e);
});

autoUpdater.on("download-progress",function(e){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("download-progress",e);
});

autoUpdater.on("update-downloaded",function(e){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("update-downloaded",e);
});

autoUpdater.on("update-not-available",function(e){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("update-not-available",e);
});

ipcMain.on('check-for-updates',function(e){
	autoUpdater.checkForUpdates();
})

setInterval(function(){
	autoUpdater.checkForUpdates();
},1000*60*15); //check for updates once every 15 minutes

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
