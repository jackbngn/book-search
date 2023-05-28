import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
	// Fetches the user's data
	const { loading, data } = useQuery(GET_ME);
	const [userData, setUserData] = useState(data?.me || {});
	console.log(userData);

	const [removeBook] = useMutation(REMOVE_BOOK);

	// Load the user's saved books on load 
	useEffect(() => {
		if (data?.me) {
			setUserData(data.me);
		}
	});

	const handleDeleteBook = async (bookId) => {
		const token = Auth.loggedIn() ? Auth.getToken() : null;

		if (!token) {
			return false;
		}

		try {
			const { data } = await removeBook({
				variables: { bookId },
			});

			const updatedUser = data.removeBook;
			setUserData(updatedUser);
			removeBookId(bookId);
		} catch (err) {
			console.error(err);
		}
	};

	if (loading) {
		return <h2>LOADING...</h2>;
	}

	return (
		<>
			<div fluid="true" className="text-light bg-dark p-5">
				<Container>
					<h1>Viewing saved books!</h1>
				</Container>
			</div>
			<Container>
				<h2 className="pt-5">
					{userData.savedBooks && userData.savedBooks.length
						? `Viewing ${userData.savedBooks.length} saved ${
								userData.savedBooks.length === 1 ? 'book' : 'books'
						  }:`
						: 'You have no saved books!'}
				</h2>

				<Row>
					{userData.savedBooks &&
						userData.savedBooks.map((book) => {
							return (
								<Col md="4" key={book.bookId}>
									<Card border="dark">
										{book.image ? (
											<Card.Img
												src={book.image}
												alt={`The cover for ${book.title}`}
												variant="top"
											/>
										) : null}
										<Card.Body>
											<Card.Title>{book.title}</Card.Title>
											<p className="small">Authors: {book.authors}</p>
											<Card.Text>{book.description}</Card.Text>
											<Button
												className="btn-block btn-danger"
												onClick={() => handleDeleteBook(book.bookId)}>
												Delete this Book!
											</Button>
										</Card.Body>
									</Card>
								</Col>
							);
						})}
				</Row>
			</Container>
		</>
	);
};

export default SavedBooks;
