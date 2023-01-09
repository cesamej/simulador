const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool(
    {
        host: "localhost",
        user:"root",
        password : "Con405C#",
        database : "simulador"
    }
)

// app.get('/', (req, res) =>{
//     const sqlGet= "Insert into simulador.simuladorui (controlName, controlLabel, value, isVisible) " + 
//                  "values('txtval', 'dos', 'val', 0)  ";
//     //const sqlGet= "Select id, controlna1me, controllabel, value, isVisible form simuladorui ";
//     db.query(sqlGet, (err, result) => {
//         res.send("Hello");
//     });
// })
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));



app.get("/api/get", (req, res) =>{
    const sqlSelect = "select id, screenconfig from simuladorui"
    db.query(sqlSelect,  (err, result) => {
        console.log(result);
        res.send(result);
    })
})

app.post("/api/update", (req, res) =>{
    const screenconfig = req.body.screenconfig;
    console.log(req.body.screenconfig);
    const sqlUpdate = "update simuladorui set screenconfig=? where id=2"
    db.query(sqlUpdate, [screenconfig], (err, result) => {
        console.log(result);
        console.log(err);
    });
})

app.get("/api/usuarios", (req, res) =>{
     const username = req.query.username;
     const password = req.query.password;
     console.log(username);
     console.log(password);
    const sqlQuery = "select id, name, username, password from usuarios where username=? and password=?"
    db.query(sqlQuery, [username, password], (err, result) => {
        console.log(result);
        res.send(result); 
    })

})


app.listen(3002, () => {
    console.log('running on port 3002');

})