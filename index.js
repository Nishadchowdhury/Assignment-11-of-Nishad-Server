const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// middleWares
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}


const uri = `mongodb+srv://${process.env.ASSIGNMENT_DB_USER}:${process.env.ASSIGNMENT_DB_PASS}@cluster0.sv4lg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect();
        const carsCollection = client.db('assignment-11').collection('carsData');


        //authentication by JWT 
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.JWT_TOKEN, { expiresIn: '1d' });
            res.send({ accessToken });
        })


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

        //get data by user email
        app.get('/getCarByUser', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const userEmail = req.query.email;

            if (userEmail === decodedEmail) {
                const query = { email: userEmail };
                const userSCar = carsCollection.find(query);
                const carsByEmail = await userSCar.toArray()
                res.send(carsByEmail)
            }
            else {
                res.status(403).send({ message: 'forbidden access' })
            }
        })

        //get data by user email
        app.get('/productCountByUser', async (req, res) => {
            const userEmail = req.query.email;
            const query = { email: userEmail };
            const userSCar = carsCollection.find(query);
            const count = await userSCar.count()
            res.json(count);
            // res.send({count})
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