#!/usr/bin/env node
import readline from 'node:readline/promises';
import fs from 'fs';
import { execSync } from 'child_process';

// print welcome message
const printWelcome = () => {
	console.log('█████╗  ██╗   ██╗████████╗ ██████╗ ██╗  ██╗██████╗');
	console.log('██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗██║  ██║╚════██╗');
	console.log('███████║██║   ██║   ██║   ██║   ██║███████║ █████╔╝');
	console.log('██╔══██║██║   ██║   ██║   ██║   ██║╚════██║██╔═══╝ ');
	console.log('██║  ██║╚██████╔╝   ██║   ╚██████╔╝     ██║███████╗');
	console.log('╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝      ╚═╝╚══════╝');
	console.log('>> This is a program that helps services using 42API automatically update secret keys every month.')
};

// get id & pw from user
const getIdAndPw = async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true
	});
	const id = await rl.question('>> Please insert your intra ID : ');
	const pw = await rl.question('>> Please insert your intra PW : ');
	rl.close();
	return [id,pw];
}

// get app path & url from user
const getAppInfo = async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true
	});
	const appPath = await rl.question('>> Please insert your APP PATH(ex, https://profile.intra.42.fr/oauth/applications/4242) : ');
	const appUrl = await rl.question('>> Please insert your APP URL(ex. https://123.123.123.123:4242) : ');
	rl.close();
	return [appPath,appUrl];
}

// main function
const run = async () => {
	try {
		// print welcome message
		printWelcome();
		
		// make config file
		let config = {};
		const idpw = await getIdAndPw();
		config.intraId = idpw[0];
		config.intraPw = idpw[1];
		const appInfo = await getAppInfo();
		config.appPath = appInfo[0];
		config.appUrl = appInfo[1];
		config.secretPath = "./";
		Object.values(config).forEach((v) => {	// check empty values
			if (!v) throw new Error('emtpy value detected');
		});
		fs.writeFileSync('config.json', JSON.stringify(config, null, 2));

		// crawling
		const command = 'npx playwright test crawling/works/crawl.spec.ts';
		execSync(command, { stdio : 'inherit' });
	} catch (e) {
		console.log(`[ERROR] ${e.message}`);
	}
}

run();