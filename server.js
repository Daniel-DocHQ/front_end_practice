const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app);
const path = require('path');
const port = 80;
const { videoToken } = require('./server/tokens');
const config = require('./server/config');

const sendTokenResponse = (token, res) => {
	res.set('Content-Type', 'application/json');
	res.send(
		JSON.stringify({
			token: token.toJwt(),
		})
	);
};

app.use(express.static(path.join(__dirname, '/build')));
app.get('/health', function(req, res) {
	res.sendStatus(200);
});

app.get('/video/token', (req, res) => {
	const identity = req.query.identity;
	const room = req.query.room;
	const token = videoToken(identity, room, config);
	sendTokenResponse(token, res);
});
app.post('/video/token', (req, res) => {
	const identity = req.body.identity;
	const room = req.body.room;
	const token = videoToken(identity, room, config);
	sendTokenResponse(token, res);
});
app.get('*', function(req, res) {
	res.sendFile(__dirname + '/build/index.html');
});
server.listen(port, () => console.log(`server is running on port ${port}`));
