import { test, expect } from '@playwright/test';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// set .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// set serial mode
test.describe.configure({ mode: 'serial' });
// SECRET KEY
let secret;

test('crawl', async ({ page }) => {
	// get all env and check
	const id = process.env.INTRA_ID;
	const pw = process.env.INTRA_PASSWORD;
	const pageURL = process.env.APPLICATION_PATH;
	const appURL = process.env.APPLICATION_URL;
	const secretPath = process.env.SECRET_PATH;
	if (!id) throw Error('[ERROR] INTRA_ID not found (check .env)');
	if (!pw) throw Error('[ERROR] INTRA_PASSWORD not found (check .env)');
	if (!pageURL) throw Error('[ERROR] APPLICATION_PATH not found (check .env)');
	if (!appURL) throw Error('[ERROR] APPLICATION_URL not found (check .env)');
	if (!secretPath) throw Error('[ERROR] SECRET_PATH not found (check .env)');

	// move to 42intra login page
	await page.goto('https://profile.intra.42.fr');
	
	// fill input with admin user's id, pw
	await page.getByPlaceholder('Login or email').fill(id);
	await page.getByPlaceholder('Password').fill(pw);

	// click LOGIN button
	await page.locator('#kc-login').click();
	
	// check LOGIN successed
	await expect(page.getByText('Black Hole absorption')).toBeVisible();

	// ** must check when login failed
	// ** must check when intra server down??

	// goto application API page
	await page.goto(pageURL);

	// check is this right page
	await expect(page.getByRole('link', { name: appURL })).toBeVisible();

	// ** must check when URL is incorrect

	// if generate button is visible
	const generateBtn = page.getByRole('link', { name: 'Generate now' });
	if (await generateBtn.isVisible()) {
		generateBtn.click();
		await page.getByRole('link', { name: 'Replace now' }).click();
	} else {
		await page.getByRole('link', { name: 'Replace now' }).click();
	}

	// check API key
	await expect(page.locator('.credential').nth(1)).toBeVisible();
	secret = await page.locator('.credential').nth(1).innerText();

	makeSecretFile(secretPath);
});

const makeSecretFile = async (dir: string) => {
	const fileName = '.secret42.txt';
	const filePath = path.join(dir, fileName);

	fs.writeFile(filePath, secret, (e) => {
		if (e)
			console.error('file writing error: ', e);
		else
			console.log('successfully writed ' + filePath);
	});
}