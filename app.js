#!/usr/bin/env node
import readline from 'node:readline/promises';
import fs from 'fs';
import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, 'config.json');
const logsPath = path.join(__dirname, 'logs');
let config = {};
let mode;	// excute mode : 0 | cron setting mode : 1

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

// set config info from user
const setConfig = async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true
	});
	config.id = await rl.question('>> Please insert your intra ID : ');
	config.pw = await rl.question('>> Please insert your intra PW : ');
	config.appPath = await rl.question('>> Please insert your APP PATH(ex. https://profile.intra.42.fr/oauth/applications/4242) : ');
	config.appUrl = await rl.question('>> Please insert your APP URL(ex. https://123.123.123.123:4242) : ');
	config.npxpath = execSync('which npx').toString().trim();
	config.nodepath = execSync('which node').toString().trim();
	config.secretPath = './';
	rl.close();
	Object.values(config).forEach((v) => {	// check empty values
		if (!v) throw new Error('emtpy value detected');
	});
	fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

// get config.json -> config Object
const getConfig = async () => {
	config = JSON.parse(fs.readFileSync(configPath).toString());
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
	return mode == 0 ? 0 : 1;
}

// playwright crawling
const crawl = async () => {
	const command = `npx playwright test crawling/works/crawl.spec.ts`;
	execSync(command, { stdio : 'inherit' });
}

// set crontab
const setCron = async () => {
	// Q&A
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: true
	});
	const day = await rl.question('>> Please insert your monthly update day (ex. 24) : ');
	// make log/err/pid file
	const logFile = fs.openSync(path.join(logsPath, 'cron.log'), 'w');
	const errFile = fs.openSync(path.join(logsPath, 'cron-err.log'), 'w');
	if (fs.existsSync(path.join(logsPath, 'pidFile'))) {	// kill process if already running
		const pid = parseInt(fs.readFileSync(path.join(logsPath, 'pidFile'), 'utf8'), 10);
		console.log(`pid ${pid} killed`);
		if (pid) process.kill(pid);
	}
	const pidFile = fs.openSync(path.join(logsPath, 'pidFile'), 'w');
	// make cron process (background)
	const cronProcess = spawn('node', [path.join(__dirname, 'cron.js'), day], {
		detached: true,
		stdio: ['ignore', logFile, errFile]
	});
	cronProcess.unref();
	console.log(`cron setting finish. new pid : ${cronProcess.pid} saved in ${logsPath}/pidFile`);
	fs.writeFileSync(pidFile, cronProcess.pid.toString());
	rl.close();
}

// main function
const run = async () => {
	try {
		printWelcome();
		mode = await checkMode();
		
		switch (mode) {
			case 0:		// excute mode
				if (await checkReset())	await setConfig();
				await crawl();
				break;
			case 1:		// cron setting mode
				if (!fs.existsSync(configPath)) throw Error('config.json not found');
				await getConfig();
				await setCron();
				break;
			default:
				break;
		}
	} catch (e) {
		console.log(e);
	}
}

run();