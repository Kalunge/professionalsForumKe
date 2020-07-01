const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectToDb = require('./config/db');

const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

// REQUIRE ROUTES
const auth = require('./routes/auth');

const app = express();

app.use(express.json());

connectToDb();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// MOUNT ROUTES
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(
		`Server Running on poort ${PORT}, in ${process.env.NODE_ENV}`.yellow.bold
	)
);

process.on('unhandledRejection', (err, Promise) => {
	console.log(`Error: ${err.message}`.red.bold);
	server.close(() => process.exit(1));
});
