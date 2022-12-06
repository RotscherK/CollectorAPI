const database = require('./db')
const searchMatchController = require('./searchMatch');
const searchItemCollection = database.collection("searchItems")

const addUpdateSearchItems = async (req, res, next) => {

    const searchItemsReq = req.body;
    console.log("SearchItems ", searchItemsReq)

    searchItemsReq.data.map(obj => ({ ...obj, user: searchItemsReq.user }))

    await Promise.all(searchItemsReq.data.map(async searchItem => {
        existingSearchItem = await searchItemCollection.get(searchItemsReq.user+searchItem.id);
        await searchItemCollection.set(searchItemsReq.user+searchItem.id, searchItem)
        searchResult = await crawlSearchItem(searchItem)
    }))

    updateSearchItemObject(searchItemsReq.user+searchItemsReq.data[0].id, searchResult)

    console.log(searchItemsReq.data.length, "SearchItems for user", searchItemsReq.user, "stored")
    res.send("SearchItems Stored, start Scrapping")
}

const getUpdateSearchItems = async (req, res, next) => {

    const user = req.body.user;
    console.log("Get Updates for user", user)

    searchItemList = await searchItemCollection.list()
    searchItems = []

    console.log(searchItemList);

    if (searchItemList != null) {
        await Promise.all(searchItemList.results.map(async item => {
            if(item.key.includes(user)){
                foundSearchItem = await searchItemCollection.get(item.key)
                console.log(foundSearchItem);
                searchItems.push(foundSearchItem.props)
            }
        }))
    }
    console.log("SearchItem matches", searchItems);

    const jsonContent = JSON.stringify(searchItems)
    res.send(jsonContent)}

const crawlSearchItem = async (searchItemObj) => {
    
    //searchItem = await searchItems.filter({id:searchItemID})
    console.log("Start Scrapping for SearchItem ", searchItemObj);

    return await searchMatchController.crawlSearchMatchesbySearchItem(searchItemObj)
}

const showAllSearchItems = async (req, res, next) => {
    searchItems = await searchItemCollection.list()
    const jsonContent = JSON.stringify(searchItems.results)
    res.send(jsonContent)
}

const deleteAllSearchItems = async (req, res, next) => {
    searchItems = await searchItemCollection.list()

    searchItems.results.forEach(item =>{
        searchItemCollection.delete(item.key);
    })

    res.send("Deleted All Search Items")
}

const updateSearchItemObject = async (searchItemKey, update) => {
    searchItem = await searchItemCollection.get(searchItemKey)
    newSearchItem = {}

    Object.assign(newSearchItem, searchItem.props, update)
    newSearchItem.itemCreated = newSearchItem.created
    newSearchItem.itemUpdated = newSearchItem.updated
    delete newSearchItem.created
    delete newSearchItem.updated

    console.log("searchItem.props", newSearchItem)
    await searchItemCollection.set(searchItemKey, newSearchItem)

}

module.exports = {
    getUpdateSearchItems,
    addUpdateSearchItems,
    showAllSearchItems,
    deleteAllSearchItems
}