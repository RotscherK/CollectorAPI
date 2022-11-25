const express = require('express')
const app = express()

const CyclicDb = require("cyclic-dynamodb")
const db = CyclicDb("amused-gold-donkeyCyclicDB")

const searchMatches = db.collection("searchMatches")

app.all('/init', async(req, res) => {
    console.log("Init Load!")
    await searchMatches.set("123", [
        {id: "1234567", searchItem: "123", title: "TestMatch1", price: "100", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow", platform: "Tutti", url: "www.tutti.ch"},
        {id: "1234568", searchItem: "123", title: "TestMatch2", price: "200", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow", platform: "Tutti", url: "www.tutti.ch"},
        {id: "1234569", searchItem: "123", title: "TestMatch2", price: "50", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow", platform: "Tutti", url: "www.tutti.ch"},
        {id: "1234519", searchItem: "123", title: "TestMatch4", price: "50", description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow", platform: "Anibis", url: "www.tutti.ch"}
    ])
    res.send('Yo!')
})

app.all('/showAll', async(req, res) => {
    console.log("Just got a request!")
    matches = await searchMatches.get(searchItemID)
    const jsonContent = JSON.stringify(matches);
    res.send(jsonContent)
})


app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.post('/searchItemMatches', async (req, res, next) => {
    const searchItemID = req.query.searchItemID;
    console.log("SearchItem ID ", searchItemID)

    matches = await searchMatches.get(searchItemID)

    console.log("SearchItem matches ", matches)

    const jsonContent = JSON.stringify(matches);

    res.send(jsonContent)
})
app.listen(process.env.PORT || 3000)