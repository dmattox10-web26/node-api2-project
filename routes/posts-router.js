const express = require('express');

const Posts = require('./data/db.js');

const router = express.Router();

router.get('/', (req, res) => {
	Posts.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(err => {
			res.status(500).json({ error: 'The posts information could not be retrieved.' });
		});
});

router.get('/:id', (req, res) => {
	Posts.findById(req.params.id)
		.then(post => {
			res.status(200).json(post);
		})
		.catch(err => {
			res.status(404).json({ message: 'The post with the specified ID does not exist.' });
		});
});

router.post('/', (req, res) => {
	if (req.body.title && req.body.contents) {
		Posts.insert(req.body)
			.then(post => {
				res.status(201).json(post);
			})
			.catch(err => {
				res.status(500).json({ error: 'There was an error while saving the post to the database' });
			});
	} else {
		res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
	}
});

router.post('/:id/comments', (req, res) => {
	if (Posts.findById(req.params.id)) {
		if (req.body.text) {
			Posts.insertComment(req.body.text)
				.then(comment => {
					res.status(201).json(comment);
				})
				.catch(err => {
					res.status(500).json({ error: 'There was an error while saving the comment to the database' });
				});
		} else {
			res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
		}
	} else {
		res.status(404).json({ message: 'The post with the specified ID does not exist.' });
	}
});

router.get('/:id/comments', (req, res) => {
	if (Posts.findById(req.params.id)) {
		Posts.findPostComments(req.params.id)
			.then(comments => {
				res.status(200).json(comments);
			})
			.catch(err => {
				res.status(500).json({ error: "The comment's information could not be retrieved." });
			});
	} else {
		//no id
		res.status(404).json({ message: 'The post with the specified ID does not exist.' });
	}
});

router.delete('/:id', (req, res) => {
	if (Posts.findById(req.params.id)) {
		Posts.remove(req.params.id)
			.then(post => {
				res.status(200).json(post);
			})
			.catch(err => {
				res.status(500).json({ error: 'The post could not be removed.' });
			});
	} else {
		//no id
		res.status(404).json({ message: 'The post with the specified ID does not exist.' });
	}
});

router.put('/:id', (req, res) => {
	if (Posts.findById(req.params.id)) {
		if (req.body.title && req.body.contents) {
			//updates post
			Posts.update(req.params.id, req.body)
				.then(post => {
					res.status(200).json(post);
				})
				.catch(err => {
					res.status(500).json({ error: 'The post information could not be modified.' });
				});
		} else {
			// missing pieces
			res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
		}
	} else {
		// no id
		res.status(404).json({ message: 'The post with the specified ID does not exist.' });
	}
});

module.exports = router;
