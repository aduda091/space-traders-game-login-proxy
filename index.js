const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser").json();
const routes = require("./routes");

const PORT = process.env.PORT || 4000;

const server = express();
server.use(bodyParser);
server.use(cors());

server.use(routes);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
