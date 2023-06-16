const express = require('express');
const path = require('path');
const apiRouter = require('./routes/api');
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://fpena213:laaaalfq545MWQOv@lifehx.wyphoaz.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
    useNewURLParser: true,
    useUnifiedTopology: true,
    dbName: 'lifehacks' //LifeHxSessions
});

mongoose.connection.once('open', () => {
  console.log('Connected to Database');
});

const PORT = 3000;
const app = express();
app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
