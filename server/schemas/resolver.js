const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const user = await User.findById(context.user._id);
				return user;
			}
			throw new AuthenticationError('Not logged in ');
		},
	},

	Mutation: {
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });
			if (!user) {
				throw new AuthenticationError('Invalid email or password');
			}
			const corretPw = await user.isCorrectPassword(password);
			if (!corretPw) {
				throw new AuthenticationError('Invalid email or password');
			}
			const token = signToken(prfile);
			return { token, profile };
		},

		saveBook: async (
			parent,
			{ authors, description, title, bookId, image, link },
			context,
		) => {
			if (context.user) {
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
				const updateUser = await User.findByIdAndUpdate(
					context.user._id,
					{ $pull: { savedBooks: { bookId } } },
					{ new: true },
				);
				return updateUser;
			}
			throw new AuthenticationError(
				' You need to be logged in to perform this action ',
			);
		},
	},
};

module.exports = resolvers;
