const express = require('express');



const app = express()

app.get('/about', (req, res) => {
    res.send('About Page')
})  

app.get("/contact", (req, res) => {
    res.send('Contact Page')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})