#!/usr/bin/env node
import readline from 'node:readline/promises';
import fs from 'fs';
import { execSync } from 'child_process';

const configPath = 'config.json';
let displayMode;	// bg : 0 | fg : 1
let runMode;		// run now : 0 | set cron : 1

// print welcome message
const printWelcome = () => {
	console.log('█████╗  ██╗   ██╗████████╗ ██████╗ ██╗  ██╗██████╗');
	console.log('██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗██║  ██║╚════██╗');
	console.log('███████║██║   ██║   ██║   ██║   ██║███████║ █████╔╝');
	console.log('██╔══██║██║   ██║   ██║   ██║   ██║╚════██║██╔═══╝ ');
	console.log('██║  ██║╚██████╔╝   ██║   ╚██████╔╝     ██║███████╗');
	console.log('╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝      ╚═╝╚══════╝');
	console.log('>> This is a program that helps services using 42API automatically update secret keys every month.')
}

// check whether user wants a reset
const checkReset = async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true
	});
	const resetStatus = await rl.question('>> Do you want to reset config.json? (y/n, default: n) : ');
	rl.close();
	return resetStatus == 'y' ? true : false;
}

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

// check if it's run mode or cron mode
const checkMode = async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true
	});
	const mode = await rl.question('>> Do you want to RUN NOW (0) or SET CRON (1) to automate? (default : 0) : ');
	rl.close();
	return mode;
}

// main function
const run = async () => {
	try {
		// get argv options
		const opt = process.argv.slice(2).at(0);
		displayMode = opt == '-b' ? 0 : 1;

		// print welcome message
		printWelcome();

		// check reset (if config is not exist)
		let configStatus;
		const configExist = fs.existsSync(configPath);
		if (displayMode == 0) { // background mode
			if (!configExist)	throw Error('background excute failed (config.json not found)');
			else configStatus = false;
		} else {				// foreground mode
			if (!configExist)	configStatus = true;
			else configStatus = await checkReset();
		}
		
		// make config file (only when configStatus is true)
		if (configStatus) {
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
			fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
		}

		// check run mode
		runMode = await checkMode();

		if (runMode == 0) {
			// start playwright for crawling
			const command = 'npx playwright test crawling/works/crawl.spec.ts';
			if (displayMode == 1)	execSync(command, { stdio : 'inherit' });
		} else {
			// set cron
			console.log('set cron');
			
		}
	} catch (e) {
		console.log(`[ERROR] ${e.message}`);
	}
}

run();