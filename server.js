const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const app = express();

app.use(bodyParser.json());

app.use(cors());

const db = knex({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "Akmm4167@",
        database: "shop"
    }
});



app.get('/', (req, res) => {
    res.json("this is working")
})

app.post('/signin', (req, res) => {
    const { ID, Password } = req.body;

    db.select("*").from("users").where({
        id: ID,
        password: Password
    }).then(users => {
        if (users.length) {
            res.json(users[0]);
        }
        else {
            db.select("*").from("admin").where({
                id: ID,
                password: Password
            }).then(admin => {
                if (admin.length) {
                    res.json(admin[0]);
                }
                else {

                    res.status(400).json("no such user found");

                }
            })
                .catch(err => res.status(400).json("error user"));
        }
    })
        .catch(err => res.status(400).json("error user"))





})

app.post('/order', (req, res) => {

    let { ID, Quantity, Weight, BoxCount } = req.body;
    Quantity = Number(Quantity);
    Weight = Number(Weight);
    BoxCount = Number(BoxCount);
    db.select("*").from("users").where({
        id: ID
    }).then(users => {
        db('users').where('id', ID)
            .update({
                quantity: Number(users[0].quantity) + Quantity,
                weight: Number(users[0].weight) + Weight,
                boxcount: Number(users[0].boxcount) + BoxCount
            })
            .then(res.json("success nd"))
    })











})

app.get('/admin', (req, res) => {
    db.select("*").from("users")
        .then(users => res.json(users))
})

app.listen(3000, () => {
    console.log("app is running on port 3000");
});
