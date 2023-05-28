const { gql } = require('apollo-server-express');

const typeDefs = gql`
	type Book {
		authors: [String]
		description: String
		bookId: String!
		image: String
		link: String
		title: String!
	}

	type User {
		_id: ID
		username: String!
		email: String!
		password: String!
		savedBooks: [Book]
	}

	type Auth {
		token: ID!
		user: User
	}

	type Query {
		me: User
		users: [User!]
		user(userId: ID!): User
	}

	input BookInput {
		authors: [String]
		description: String
		title: String
		bookId: String
		image: String
		link: String
	}

	type Mutation {
		addUser(username: String!, email: String!, password: String!): Auth
		login(email: String!, password: String!): Auth
		saveBook(bookInput: BookInput!): User
		removeBook(bookId: String): User
	}
`;

module.exports = typeDefs;
