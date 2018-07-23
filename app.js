var restify = require('restify');
var builder = require('botbuilder');
console.log("Hello friends");
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
	
		(function() {
		"use strict";
		
		if(!process.argv[2]){
		console.log("Usage:\n");
		console.log(process.argv[0] + " " + process.argv[1] + " <severName>\n");
		console.log("Where:\n<serverName>\tThe name being advertised by the Bluetooth Server\n");
		process.exit(-1);
		}

		var serverName = process.argv[2];
		

		var util = require('util');
		var DeviceINQ = require("./node_modules/bluetooth-serial-port/lib/device-inquiry.js").DeviceINQ;
		var BluetoothSerialPort = require("./node_modules/bluetooth-serial-port/lib/bluetooth-serial-port.js").BluetoothSerialPort;
		var serial = new BluetoothSerialPort();
		const MAX_MSGS_SENT = 10;
		var keepScanning = false;

		serial.on('found', function (address, name) {
			console.log('Found: ' + address + ' with name ' + name);

			serial.findSerialPortChannel(address, function(channel) {
				console.log('Found RFCOMM channel for serial port on ' + name + ': ' + channel);

				if (name !== serverName) return;

				console.log('Attempting to connect...');

				serial.connect(address, channel, function() {
			keepScanning  = false;
				let packetsSent = 0;
					console.log('Connected. Sending data...');
					let buf = new Buffer('f');
					console.log('Size of buf = ' + buf.length);

			serial.on('failure', function(err){
				console.log('Something wrong happened!!: err = ' + err);
			});

					serial.on('data', function(buffer) {
						console.log('Received: Size of data buf = ' + buffer.length);
						console.log(buffer.toString('utf-8'));
				serial.write(buf, function(err,count){
							if(err){
								console.log('Error received: ' + err);
					return;
						}
						
				console.log('Sent: Bytes written: ' + count);
				packetsSent++;
				console.log('Sent: count = ' + packetsSent);
				if(packetsSent == MAX_MSGS_SENT){
					console.log('' + MAX_MSGS_SENT + ' sent!. Closing connection');
					serial.close();
					process.exit(0);
				}
				});
					});

					serial.write(buf, function(err, count) {
						if (err) {
							console.log('Error received: ' + err);
						} else {
							console.log('Bytes writen is: ' + count);
						}
					});
				});
			});
		});

		serial.on('close', function() {
			console.log('connection has been closed (remotely?)');
		});

		serial.on('finished', function() {
			console.log('Scan finished.');
		if(keepScanning == true){
			console.log('Rescanning..');
			serial.inquire();
		}
		});

		serial.inquire();
	})();
});