const express = require('express')
const app = express()

app.get('/',(req,res) => {
    res.send('Bienvenido a PyCraft');
});



module.exports= app;