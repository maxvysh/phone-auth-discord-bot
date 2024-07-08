const mongoose = require('mongoose');
require("dotenv").config();
const fs = require("fs");

const dbURI = process.env.mongoURI;

mongoose.connect(dbURI)
    .then(async () => { // Make this function async
        console.log('MongoDB connected...');
        await printAllDataFromAllCollections(); // Await the async function
        mongoose.disconnect(); // Disconnect from MongoDB
        process.exit(); // Exit the process
    })
    .catch(err => {
        console.error(err);
        process.exit(1); // Exit with error code
    });

const printAllDataFromAllCollections = async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
        console.log(`Data from ${collection.name}:`);
        const docs = await mongoose.connection.db.collection(collection.name).find().toArray();
        fs.writeFileSync(`${collection.name}.json`, JSON.stringify(docs, null, 2), 'utf8');
    }
};

// Removed the direct call to printAllDataFromAllCollections() here