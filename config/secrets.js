require('dotenv').config();

export default {
	BASE_URL: process.env.BASE_URL,
	/**
	 * Amazon Web Services Config Keys
	 */
	AWS: {
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		region: process.env.AWS_REGION
	},
	/**
	 * Database Secret Credentials;
	 */
	DATABASE: process.env.MONGO_URL,
	/**
	 * Node.js Environment
	 */
	env: process.env.NODE_ENV,
	/**
	 * JWT Secret Credential;
	 */
	JWT_SECRET: process.env.JWT_SECRET,

	/**
	 * MAIL SERVICE
	 */
	MAIL_SERVICE: {
		HOST: process.env.SMTP_HOST,
		USER: process.env.SMTP_USER,
		PASS: process.env.SMTP_PASS
	},
	PAYMENTS: {
		SECRET_KEY: process.env.EYOWO_SECRET_KEY,
		PUBLIC_KEY: process.env.EYOWO_PUBLIC_KEY,
	}
};
