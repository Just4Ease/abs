/**
 * Core abs API Dependencies;
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import SocketIO from 'socket.io';
import { Server } from 'http';
import APP_ROOT from 'app-root-path';

import { configServer } from './config';

/**
 * Initialize express
 * Bound a reusable server object for socket.io to the initialized express;
 */
const abs = express();
const server = new Server(abs);

/**
 * Socket.io listening on the server;
 */
const io = SocketIO(server, {
	path: '/ws', // ws means websocket
	transports: ['websocket', 'polling']
});

io.set('origins', '*:*');

Object.assign(global, {
	io,
	APP_ROOT
});
/**
 *  View engine setup
 */
abs.set('views', path.join(__dirname, 'views'));
abs.use(express.static(path.join(__dirname, 'views')));
abs.set('view engine', 'pug');

/**
 * Cors Configuration;
 */
abs.use(cors({ origin: '*' }));


configServer(io, abs, express);

/**
 * exports the abs for use by other configurations
 *  with sockets.io plugged in.
 */
export {
	abs,
	server
};
