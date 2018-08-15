const http = require('http');

const app = require('./backend/app-reconciliation');
// const app = require('./backend/blockchain-tripeur');

const port = process.env.PORT || "3000";

app.set("port", port);

const server = http.createServer(app);

console.log(port);
server.listen(port);
