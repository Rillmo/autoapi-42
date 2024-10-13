#!/usr/bin/env node
import readline from 'readline';
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

// get input from user
const getIdAndPw = async () => {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			terminal: true,
		});
		let config = {intraID:"", intraPW:"", secretPath:"", appPath:"", appUrl:""};
		// get id
		rl.question('>> Please insert your intra ID : ', (id)=>{
			config.intraID = id;
			rl.stdoutMuted = true;
			// get pw
			rl.question('>> Please insert your intra PW : ', (pw)=>{
				config.intraPW = pw;
				resolve(config);
			});
			// mask pw input
			rl._writeToOutput = (stringToWrite) => {
			if (rl.stdoutMuted)
				rl.output.write("*");
			else
				rl.output.write(stringToWrite);
			};
		});
		rl.stdoutMuted = false;
	});
};

// main function
const run = async () => {
	printWelcome();
	const config = await getIdAndPw();
	fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
}

run();