#!/usr/bin/env node
import readline from 'node:readline/promises';
import fs from 'fs';

let id, pw;

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
	// get id
	const id = await rl.question('>> Please insert your intra ID : ');
	const pw = await rl.question('>> Please insert your intra PW : ');
	rl.close();
	return [id,pw];
}

// main function
const run = async () => {
	try {
		printWelcome();
		const config = await getIdAndPw();
		console.log(config);
		config.forEach((v) => {	// check empty values
			if (!v) throw new Error('emtpy value detected');
		});
		fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
	} catch (e) {
		console.log(`[ERROR] ${e.message}`);
	}
}

run();