const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

        //getting alldata for clint site HOME
        app.get('/allCars', async (req, res) => {
            const cursor = carsCollection.find();
            const cars = await cursor.toArray();
            res.send(cars)

        });

        //getting multipleData for clint site HOME
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = carsCollection.find(query).limit(6);
            const cars = await cursor.toArray();
            res.send(cars)

        });

        //getting singleCarsData
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const car = await carsCollection.findOne(query);
            res.send(car);
        })

        //update data of Quantity or else 
        app.put('/Update/:id', async (req, res) => {
            const id = req.params.id;
            const carData = req.body;
            console.log('from put method' + id);

            const find = { _id: ObjectId(id) };

            console.log(req.body);


            const updateDoc = {
                $set: {
                    picture: carData.picture,
                    name: carData.name,
                    email: carData.email,
                    about: carData.about,
                    price: carData.price,
                    quantity: carData.quantity,
                    supplierName: carData.supplierName
                },
            };

            const result = await carsCollection.updateOne(find, updateDoc);
            res.send(result)

        });


        // delete an item 

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id; //getting id
            const query = { _id: ObjectId(id) };
            const result = await carsCollection.deleteOne(query);
            res.send(result);
        })

        //add an item
        app.post('/inventory', async (req, res) => {
            // const newCar = req.body;
            // const result = await carsCollection.insertOne(newCar);
            // res.send(result);

            const newCar = req.body;
            const result = await carsCollection.insertOne(newCar);
            res.send(result);
        })




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