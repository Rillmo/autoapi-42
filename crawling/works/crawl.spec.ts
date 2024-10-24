import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// set config.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../../config.json');
// set serial mode
test.describe.configure({ mode: 'serial' });
// SECRET KEY
let secret: string;

test('crawl', async ({ page }) => {
	try {
		// get all env and check
		const configFile: string = fs.readFileSync(configPath, 'utf-8');
		const config = JSON.parse(configFile);
		const id = config.intraId;
		const pw = config.intraPw;
		const pageURL = config.appPath;
		const appURL = config.appUrl;
		const secretPath = config.secretPath;
		if (!id) throw Error('[ERROR] INTRA_ID not found (check config.json)');
		if (!pw) throw Error('[ERROR] INTRA_PASSWORD not found (check config.json)');
		if (!pageURL) throw Error('[ERROR] APPLICATION_PATH not found (check config.json)');
		if (!appURL) throw Error('[ERROR] APPLICATION_URL not found (check config.json)');
		if (!secretPath) throw Error('[ERROR] SECRET_PATH not found (check config.json)');
	
		// move to 42intra login page
		await page.goto('https://profile.intra.42.fr');
		
		// fill input with admin user's id, pw
		await page.getByPlaceholder('Login or email').fill(id);
		await page.getByPlaceholder('Password').fill(pw);
	
		// click LOGIN button
		await page.locator('#kc-login').click();
		
		// check LOGIN successed
		await expect(page.getByText('Black Hole absorption')).toBeVisible();
	
		// ** add check when login failed
		// ** add check when intra server down??
	
		// goto application API page
		await page.goto(pageURL);
	
		// check is this right page
		await expect(page.getByRole('link', { name: appURL })).toBeVisible();
	
		// ** add check when URL is incorrect
	
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
	} catch (e) {
		console.log(`[ERROR] ${e}`);
	}
});

const makeSecretFile = async (dir: string) => {
	const fileName: string = '.secret42.txt';
	const filePath: string = path.join(dir, fileName);

	fs.writeFileSync(filePath, secret);
}