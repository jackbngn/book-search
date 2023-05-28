const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const user = await User.findById(context.user._id).populate(
					'savedBooks',
				);
				return user;
			}
			throw new AuthenticationError('Not logged in');
		},
		users: async () => {
			try {
				const users = await User.find();
				return users;
			} catch (err) {
				throw new Error('Failed to fetch users');
			}
		},
	},

	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			try {
				const user = await User.create({ username, email, password });

				const token = signToken(user);

				return { token, user };
			} catch (err) {
				throw new AuthenticationError('Error creating user');
			}
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });
			if (!user) {
				throw new AuthenticationError('Invalid email or password');
			}
			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) {
				throw new AuthenticationError('Invalid email or password');
			}
			const token = signToken(user);
			return { token, user };
		},

		saveBook: async (parent, { bookInput }, context) => {
			if (context.user) {
				const { authors, description, title, bookId, image, link } = bookInput;
				const updatedUser = await User.findByIdAndUpdate(
					context.user._id,
					{
						$push: {
							savedBooks: { authors, description, title, bookId, image, link },
						},
					},
					{ new: true },
				);
				return updatedUser;
			}
			throw new AuthenticationError(
				'You need to be logged in to perform this action',
			);
		},
		removeBook: async (parent, { bookId }, context) => {
			if (context.user) {
				const updatedUser = await User.findByIdAndUpdate(
					context.user._id,
					{ $pull: { savedBooks: { bookId } } },
					{ new: true },
				);
				return updatedUser;
			}
			throw new AuthenticationError(
				'You need to be logged in to perform this action',
			);
		},
	},
};

module.exports = resolvers;
