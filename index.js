const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("./Public"));

function log(text) {
    console.log("---------------");
    console.log(text);
    console.log("---------------");
}

app.listen(PORT, function() {
    log("Listening  at port " + PORT);
});