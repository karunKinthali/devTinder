const mongoose = require('mongoose');

const dbUrl = "mongodb+srv://karun:karun@learnnode.snherwh.mongodb.net/devTinder";
const connectionDb = async () => {
    await mongoose.connect(dbUrl);
}

module.exports = connectionDb;
