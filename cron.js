import { CronJob } from 'cron';
import { execSync } from 'child_process';

// playwright crawling
const crawl = async () => {
	console.log(`[${new Date()}]`);
	const command = `npx playwright test crawling/works/crawl.spec.ts`;
	execSync(command, { stdio : 'inherit' });
}

const run = () => {
	// get argv params
	const day = process.argv.slice(2).at(0);
	// set job
	const job = new CronJob(
		`0 0 0 ${day} * *`,
		() => {
			crawl();
		},
		null
	);
	job.start();
}

run();