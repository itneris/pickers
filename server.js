const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.get('/api/test', (req, res) => {
    res.send({ });
});


app.listen(port, () => console.log(`Listening on port ${port}`));