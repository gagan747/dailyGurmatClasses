const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dbuser:Waheguru747477%40@cluster0.pkxnk.mongodb.net/pathDuties?retryWrites=true&w=majority')
.then(() => console.log('Connected to MongoDB...'))
.catch((err) => console.error(`${err}`));

