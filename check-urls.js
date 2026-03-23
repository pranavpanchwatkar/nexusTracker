const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/promotion_tracker')
  .then(async () => {
    const db = mongoose.connection.db;
    const subs = await db.collection('submissions').find({}).toArray();
    console.log("Submissions:");
    subs.forEach(s => console.log(s.timestamp, s.imageUrl));
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
