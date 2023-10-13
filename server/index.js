const express = require('express');
const cors = require('cors');
const fs = require('fs');
const util = require('util');

const PORT = process.env.PORT || 3030;

const app = express();
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.post("/getData", async (req, res) => {
    const path = './data/JSON/' + req.body.fileName;
    const buff = await readFile(path);
    let content = buff.toString();
    const obj = JSON.parse(content);
    res.send(obj);
});

app.post("/writeData", async (req, res) => {
    const fileName = req.body.fileName;
    const path = './data/JSON/' + fileName;
    const data = JSON.stringify(req.body.writtenData);
    writeFile(path, data);
    res.send(data);
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})