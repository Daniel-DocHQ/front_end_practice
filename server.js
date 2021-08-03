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

app.get('/voice/answer', (req, res) => {
	console.log('NCCO request:');
	console.log(`  - callee: ${req.query.to}`);
	console.log('---');
	res.json([
	  {
		"action": "talk",
		"text": "Please wait while we connect you."
	  },
	  {
		"action": "connect",
		"from": 447418362000,
		"endpoint": [
		{
			"type": "phone",
			"number": req.query.to,
		}
		]
	  }
	]);
  });

app.post('/voice/answer', (req, res) => {
	console.log('NCCO request:');
	console.log(`  - callee: ${req.query.to}`);
	console.log('---');
	res.json([
	  {
		"action": "talk",
		"text": "Please wait while we connect you."
	  },
	  {
		"action": "connect",
		"from": 447418362000,
		"endpoint": [
		{
			"type": "phone",
			"number": req.query.to,
		}
		]
	  }
	]);
});

//   app.get('/call', (req, res) => {
// 	vonage.calls.create({
// 	  to: [{
// 		type: 'phone',
// 		number: req.query.to
// 	  }],
// 	  from: {
// 		type: 'phone',
// 		number: '447418362000', //process.env.REACT_APP_VONAGE_NUMBER,
// 	  },
// 	  ncco: [{
// 		action: 'talk',
// 		text: req.query.msg || 'This call was made from JavaScript.',
// 		language: 'en-IN',
// 		style: '4'
// 	  }]
// 	}, (err, resp) => {
// 	  if (err)
// 		console.error(err);
// 	  if (resp)
// 		console.log(resp);
// 	});
// 	res.json('ok');
//   });

  app.all('/voice/event', (req, res) => {
	console.log('EVENT lol:');
	console.dir(req.body);
	console.log('---');
	res.sendStatus(200);
  });

  app.get('*', function(req, res) {
	res.sendFile(__dirname + '/build/index.html');
  });
server.listen(port, () => console.log(`server is running on port ${port}`));
