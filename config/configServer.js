/**
 * Core Config dependencies;
 */
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from '../routes';
import { executeExtraction, fetchFileFromURL } from '../utils';

/**
 * Configures the server handlers and mounts the routes.
 * @param io
 * @param abs
 * @param express
 * @returns {*}
 */
export default (io, abs, express) => {
	abs.use(logger('short'));
	abs.use(bodyParser.json()); // apply bodyParser.json() to all requests.
	abs.use(bodyParser.urlencoded({
		extended: true
	}));

	/**
	 * Initializes the API Routes;
	 */
	abs.use('/', routes(express));

	/**
	 *  catch 404 and forward to error handler
	 */
	abs.use((req, res, next) => {
		const err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	/**
	 * error handler
	 */
	abs.use((err, req, res, next) => {
		/**
		 * set locals, only providing error in development
		 */
		res.locals.message = err.message;
		res.locals.error = req.get('env') === 'development' ? err : {};
		/**
		 * render the error page
		 */
		res.status(err.status || 500);
		console.log(err); // mount AMP Here.
		if (process.env.NODE_ENV !== 'production') {
			res.render('error'); // Do not render the error on production.
		}
		// and optionally displayed to the user for support.
		res.statusCode = 500;
		return next();
	});

	io.on('connection', (socket) => {
		socket.on('image::captured', (data, cb) => {
			const { point } = data;

			let url;
			switch (point) {
				case 'ENTRY':
					url = 'http://192.168.1.109/tmpfs/auto.jpg';
					break;
				case 'EXIT':
					url = 'http://192.168.1.110/tmpfs/auto.jpg';
					break;
				default:
					url = null;
			}


			// Execute extraction
			const result = executeExtraction(url);
			// if (!result) {
			// 	return cb({
			// 		status: false,
			// 		data: null
			// 	});
			// }
			return cb({
				status: !!result,
				data: result
			});
		});
	});

	return abs;
};
