const express = require('express');
const knex = require('knex');

const dbConfig = require('./knexfile.js');
const db = knex(dbConfig.development);

const bcrypt = require('bcrypt');

const server = express();
server.use(express.json());

server.post('/api/register', (req,res) => {
    let user = req.body;
    if(user.username && user.password){
        const hash = bcrypt.hashSync(user.password, 10)
        user.password = hash;

        db('Users').insert(user)
            .then(user => {
                res.status(200).json({message: 'User created successfully'})
            })
            .catch(err => {
                res.status(500).json({message: 'Server Error'})
            })
    } else {
        res.status(400).json({message: 'invalid credentials'})
    }
});

server.post('/api/login', (req,res) => {
    let { username, password } = req.body;
    if(username, password){
        db('Users').where({username})
            .first()
            .then( user => {
               if (user && bcrypt.compareSync(password, user.password)){
                   res.status(200).json({message: `Come in ${user.username}`})
               } else {
                   res.status(401).json({message: 'Check ya credentials'})
               }
            }).catch(err => {
                res.status(500).json({message: 'Issue on the $erver'})
            })
    } else {
        res.status(401).json({message: 'Missing Credentials'})
    }
});

server.get('/api/users', (req,res) => {
    db('Users').select('id', 'username', 'password')
        .then( users => {
            res.status(200).json({users})
        })
})

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));