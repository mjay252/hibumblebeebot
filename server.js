require('dotenv').config();

const tmi = require('tmi.js');
const fs = require('fs');

let toxicCount;

// Define configuration options
const opts = {
	connection: {
	reconnect: true
	},
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN,
	},
	channels: [
		'deanbydaylight',
		'hibumblebeetuna',
		'memebearcave',
		'sinph0nic',
		'nugtoriousamy',
	]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
// Ignore messages from the bot
if (self) {
	return;
}

	if(msg === "!toxic") {
		try {
			const data = fs.readFileSync('./toxicCount.json');
			toxicCount = JSON.parse(data);
		} catch (err) {
			console.error(err);
		}

		let currentCount = toxicCount.toxicCount;
		currentCount++;
		let tempToxicCount = {
			"toxicCount" : currentCount
		}

		let data = JSON.stringify(tempToxicCount);
		fs.writeFileSync('./toxicCount.json', data);
		let toxicResponse = "Bumble has been toxic " + currentCount + " times. So toxic!";

		client.say(target, toxicResponse);
		console.log(toxicResponse)
		console.log(`* Executed toxic trigger command`);
	}

	if(msg === "!toxiccount") {
		try {
			const data = fs.readFileSync('./toxicCount.json');
			toxicCount = JSON.parse(data);
		} catch (err) {
			console.error(err);
		}

		let currentCount = toxicCount.toxicCount;
		let toxicResponse = "Bumble toxic count: " + currentCount;

		client.say(target, toxicResponse);
		console.log(toxicResponse)
		console.log(`* Executed toxic trigger command`);
	}
};

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
};