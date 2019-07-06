import path from 'path';

export default (express) => {
	const { Router } = express;
	const api = new Router();


	api.get('/', (req, res) => res.sendFile(path.resolve(path.join('views', 'index.html'))));

	return api;
};
