const mongoose = require('mongoose');
const cities = require('./cities');
const { resorts } = require('./seedHelpers');
const Resort = require('../models/resort');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL; 

// Put below code back in to replace dbUrl to connect local
// 'mongodb://localhost:27017/go-to-snow'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Resort.deleteMany({});
    // for (let i = 0; i < 300; i++) {
    //     const random1000 = Math.floor(Math.random() * 1000);
    //     const price = Math.floor(Math.random() * 20) + 10;
    //     const resort = new Resort({
    //         //Your user id
    //         author: '607709565b04b700156cd90d',
    //         location: `${cities[random1000].city}, ${cities[random1000].state}`,
    //         name: `${sample(resorts)}`,            
    //         description: 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //         price,
    //         geometry: {
    //             type: "Point",
    //             coordinates: [
    //                 cities[random1000].longitude,
    //                 cities[random1000].latitude,
    //             ]
    //         },
    //         images: [
    //             {
    //                 url: 'https://images.unsplash.com/photo-1500886607519-5176fca3bc20?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1334&q=80',
    //                 filename: 'GoToSnow/stocksnow1_qmjzo9'
    //             },
    //             {
    //                 url: 'https://images.unsplash.com/photo-1601721360403-ac2578993a3c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80',
    //                 filename: 'GoToSnow/stocksnow2_p8zmi'
    //             }
    //         ]
    //     })
    //     await resort.save();
    // }
}

seedDB().then(() => {
    mongoose.connection.close();
})