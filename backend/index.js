const express = require('express')
const app = express()

app.get('/',(req,res) => {
    res.send('Bienvenido a PyCraft');
});

const PORT = process.env.PORT || 30001;

app.listen(PORT, () => {
    console.log(`server is running in http://localhost:${PORT}`)
});

module.exports= app;