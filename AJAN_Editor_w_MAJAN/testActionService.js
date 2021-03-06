const express = require('express');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 4201;

//initialize a simple http server
const server = http.createServer(app);

let start;
let startAll;
let endAll;
let performance = "";
let iterations = 1000;
let iteration = 0;
let data = "";
let body = "";
let response = "<http://localhost:4201/post> <http://localhost:4201/test-service-ns#message>  <http://localhost:4201/test-service-ns#Received> .";
const wss = new WebSocket.Server({ server });

app.use(bodyParser.text({ type: 'text/plain', limit: '50mb' }));
app.use(bodyParser.text({ type: 'text/turtle', limit: '50mb' }));
app.use(bodyParser.text({ type: 'text/xml', limit: '50mb' }));
app.use(bodyParser.text({ type: 'application/json', limit: '50mb' }));
app.use(bodyParser.text({ type: 'application/sparql-results+xml', limit: '50mb' }));
app.use(bodyParser.text({ type: 'application/trig', limit: '50mb' }));
app.use(bodyParser());
app.use(function (err, req, res, next) {
  console.error(err.stack);
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/performance', (req, res) => {
  let total = endAll - startAll - (1000 * iterations) ;
  let average = total / iterations;
  res.send(performance + " --> " + total + "ms" + ", 1 cycle = " + average + "ms");
});

app.get('/start', (req, res) => {
  res.send('start');
  iteration = iterations;
  performance = "";
  startAll = Date.now();
  /*try {
    data = fs.readFileSync('/Projects/AJAN/github/AJAN-editor/test_rdf.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }*/
  sendRequest();
});

function sendRequest() {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/ajan/agents/test?capability=execute',
    method: 'POST',
    headers: {
      'Content-Type': 'text/turtle',
      'Content-Length': data.length
    }
  }

  const reqTest = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    res.on('data', d => {
      process.stdout.write(d)
    });
  });

  reqTest.on('error', error => {
    console.error(error)
  });
  start = Date.now();
  reqTest.write(data);
  reqTest.end();
}

app.post('/end', (req, res) => {
  console.log("\r-------------------------------");
  console.log(req.body);
  let end = Date.now() - start;
  console.log("\r-------------------------------");
  console.log("performance time:" + end);
  console.log("-------------------------------");
  console.log(req.body);
  console.log("-------------------------------");
  res.send("");
  iteration -= 1;
  performance += (iterations - iteration) + ": " + end + "ms; ";
  console.log(iteration);
  if (iteration > 0) {
	var waitTill = new Date(new Date().getTime() + 1 * 1000);
	while(waitTill > new Date()){}
    sendRequest();
	console.log("sent!");
  } else {
    endAll = Date.now();
  }
});

app.get('/getResponse', (req, res) => {
  res.send(response);
});

app.post('/response', (req, res) => {
  console.log(req.body);
  response = req.body;
  res.send("");
});

app.post('/post', (req, res) => {
  let wssMessage = {};
  wssMessage.date = new Date().toUTCString();
  wssMessage.headers = getHeaders(req.headers);
  wssMessage.body = req.body;
  console.log(wssMessage);
  wss.clients.forEach(client => {
	  body = wssMessage;
    client.send(JSON.stringify(wssMessage));
  });
  res.set('Content-Type', 'text/turtle');
  res.send(response);
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
	  ws.send(message);
  });

  ws.on("error", (err) => {
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack);
  });

  sendConnectMessage(ws);
});

server.listen(port, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

function getHeaders(headers) {
  let headersList = new Array();
  for(var propt in headers){
    headersList.push({"key": propt, "value": headers[propt]});
  }
  return headersList;
}

function sendConnectMessage(ws) {
  let wssMessage = {};
  wssMessage.body = "You are now connected to the TestActionService (testActionService.js)!";
  const start = Date.now();
  ws.send(JSON.stringify(wssMessage));
  wssMessage.body = "This is the last response: .";
  let now = Date.now();
  while ((Date.now() - now) < 1000) { }
  while ((Date.now() - start) < 5000) {
    now = Date.now();
    while ((Date.now() - now) < 500) {}
    wssMessage.body = wssMessage.body + ".";
    ws.send(JSON.stringify(wssMessage));
  }
  ws.send(JSON.stringify(body));
  console.log("send!");
}
