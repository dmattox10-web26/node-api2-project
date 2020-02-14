const express = require('express');
const postsRouter = require('./routes/posts-router');
const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);

server.get('/', (req, res) => {
	res.send('online');
});

server.listen('5000', () => {
	console.log('Server listening on 5000.');
});
