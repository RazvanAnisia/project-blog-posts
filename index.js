const express = require('express');

const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(
  'mongodb://raz:Nucleotida93@ds127545.mlab.com:27545/rest-tutorial',
  console.log('Connected to DB')
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Import Routes
const postsRoutes = require('./routes/posts');
app.use('/posts', postsRoutes);

app.listen(9000);
