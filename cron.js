import { CronJob } from 'cron';

const run = () => {
	// get argv params
	const day = process.argv.slice(2).at(0);
	// set job
	const job = new CronJob(
		`0 0 0 ${day} * *`,
		() => {
			const d = new Date();
			console.log('now: ', d);
		},
		null
	);
	job.start();
}

run();