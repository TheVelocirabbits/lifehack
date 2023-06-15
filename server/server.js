const express = require('express');
const path = require('path');
const apiRouter = require('./routes/api');

const MONGO_URI = 'our URI';

mongoose.connect(MONGO_URI, {
    useNewURLParser: true,
    useUnifiedTopology: true,
    dbName: 'our db name'
});

mongoose.connect.once('open', () => {
  console.log('Connected to Database');
});

const PORT = 3000;
const app = express();
app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
