const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleWares
app.use(cors());
app.use(express.json());

//assignment-11   DbsK9llY47PNPrLd



const uri = `mongodb+srv://${process.env.ASSIGNMENT_DB_USER}:${process.env.ASSIGNMENT_DB_PASS}@cluster0.sv4lg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect();
        const carsCollection = client.db('assignment-11').collection('carsData');


        //getting multipleData for clint site HOME
        app.get('/allCarsHomePage', async (req, res) => {
            const query = {};
            const cursor = carsCollection.find(query).limit(6);
            const cars = await cursor.toArray();
            res.send(cars)

        });

        


    }
    finally {

    }
}



run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server of assignment 11 is running at port');
});

app.listen(port, () => {
    console.log('listening to port is', port);
})