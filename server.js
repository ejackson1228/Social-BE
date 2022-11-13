const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); //not needed, as there is no 'public' directory for use

app.use(require('./routes'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/social-BE', { // not deploying to heroku as of now, but still setting up for future deployment
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('debug', true); // show mongodb queries in terminal 

app.listen(PORT, () => console.log(`Connected on localhost:${PORT}`));
