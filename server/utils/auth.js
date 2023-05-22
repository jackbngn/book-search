const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
	// function for our authenticated routes
	authMiddleware: function ({ req }) {
		// Get the autthorization header
		const token = req.headers.authorization || '';

		if (!token) {
			throw new Error('You have no token!');
		}

		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch (error) {
			console.log('Invalid token:', error);
			throw new Error('Invalid token!');
		}
	},
	signToken: function ({ username, email, _id }) {
		const payload = { username, email, _id };

		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};
