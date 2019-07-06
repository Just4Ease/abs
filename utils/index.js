import axios from 'axios';
import { spawnSync } from 'child_process';
import { encode } from 'base-64';

import fs from 'fs';

const APP_ROOT = require('app-root-path');

/**
 * This generates an alphanumeric ID,
 * based on the number of characters provided.
 * @param {Number} length
 * @returns String
 */
export const generateId = (length = 10) => { // Default length is 10 Characters;
	let result = '';
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for (let i = length; i > 0; --i) { // eslint-disable-line
		result += chars[Math.floor(Math.random() * chars.length)];
	}

	return result;
};

const PATH = `${APP_ROOT}`;

const DEFAULTS = {
	url: 'http://www.httpwatch.com/httpgallery/authentication/authenticatedimage/default.aspx?0.9885063925729536',
	username: 'httpwatch',
	password: 'JusticeNefe'
};

/**
 * Fetch file from url.
 * With basic auth.
 * @param url
 * @param username
 * @param password
 * @returns {Promise<boolean>}
 */
export const fetchFileFromURL = async (
	url = DEFAULTS.url,
	username = DEFAULTS.username,
	password = DEFAULTS.password
) => {
	const response = await axios.get(url, {
		responseType: 'stream',
		headers: {
			Authorization: `Basic ${encode(`${username}:${password}`)}`,
		}
	});

	try {
		if (fs.existsSync(`${PATH}/car.jpg`)) {
			fs.unlinkSync(`${PATH}/car.jpg`);
			console.log('Image Deleted .jpg');
		}
		if (fs.existsSync(`${PATH}/car.png`)) {
			fs.unlinkSync(`${PATH}/car.png`);
			console.log('Image Deleted .png');
		}
		response.data.pipe(fs.createWriteStream(`${PATH}/car.jpg`));
		console.log('Image Downloaded');
		return true;
	} catch (e) {
		return false;
	}
};


/**
 * Execute Plate Number Extraction from the car.jpg using python.
 * @returns {null|{img: string, plate: string, time: Date}}
 */
export const executeExtraction = (url) => {
	// Remove file before starting.
	if (fs.existsSync(`${PATH}/car.jpg`)) {
		fs.unlinkSync(`${PATH}/car.jpg`);
	}

	if (fs.existsSync(`${PATH}/abs-extraction/car.jpg`)) {
		fs.unlinkSync(`${PATH}/abs-extraction/car.jpg`);
	}

	const { stderr, stdout } = spawnSync(
		'python',
		[
			'-W ignore',
			`${PATH}/abs-extraction/Extraction.py`,
			'-u',
			`${url}`
		],
		{ shell: true }
	);

	if (stderr.toString()
		.trim() !== '') {
		console.log(stderr.toString());
		return null;
	}

	const plate = String(stdout.toString())
		.trim();

	if (String(plate)
		.trim().length === 0) {
		return null;
	}


	const file = fs.readFileSync(`${PATH}/car.jpg`, 'base64');

	console.log(file, ' File.');

	if (!file) {
		return null;
	}

	return {
		img: `data:image/jpeg;base64,${file}`,
		plate,
		time: new Date(Date.now())
	};
};
