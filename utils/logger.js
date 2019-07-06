const request = require('request');
const conn = require('../config/db.js');

const Log = conn.models.log;

/**
 * Logs Requests and saves into the database.
 * @param id
 * @param srcip
 * @param event
 * @param title
 * @param description
 */
export default async (id, srcip, event, title, description) => {
	const log = new Log();
	log.event = event;
	log.title = title;
	log.src_ip = srcip;
	log.description = description;
	log.admin = id;


	request({
		method: 'GET',
		url: `https://tools.keycdn.com/geo.json?host=${srcip}`
	}, async (err, res, body) => {
		console.log(body);

		const json = JSON.parse(body);

		if (json.status === 'success') {
			console.log('success');
			log.geo = json.data.geo;
		}

		console.log(log);

		await Log.create({
			event,
			title,
			src_ip: srcip,
			description,
			admin: id
		})
			.catch(err => {
				console.log(err, ' Error Saving Logs To Database.');
			});
	});
};
