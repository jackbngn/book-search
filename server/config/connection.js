const mongoose = require('mongoose');

mongoose.connect(
	process.env.MONGODB_URI || 'mongodb://localhost/bookCollection',
);

module.exports = mongoose.connection;
