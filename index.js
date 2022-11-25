const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.all('/searchItemMatches', (req, res) => {

    console.log("Just got a request!")
    const responseData = [
        {searchItem: "123", title: "Lorem i", price: "100", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow", platform: "Tutti", url: "www.tutti.ch"},
        {searchItem: "123", title: "TestMatch2", price: "200", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow", platform: "Tutti", url: "www.tutti.ch"},
        {searchItem: "123", title: "TestMatch2", price: "50", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow", platform: "Tutti", url: "www.tutti.ch"}
    ]
    
    const jsonContent = JSON.stringify(responseData);

    res.send(jsonContent)
})
app.listen(process.env.PORT || 3000)