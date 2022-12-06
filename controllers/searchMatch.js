const database = require('./db')
const crawlerController = require('./crawler');
const searchMatchCollection = database.collection("searchMatches")


const getSearchItemMatchesbySearchItem =  async (req, res, next) => {

    const searchItemID = req.body.searchItemID;
    console.log("SearchItem ID ", searchItemID)

    matchesCollection = await searchMatchCollection.get(searchItemID)
    matches = []

    if (matchesCollection != null) {
        Object.keys(matchesCollection.props).forEach(key => {
            if (matchesCollection.props[key].hasOwnProperty('id')) {
                //console.log(key, matchesCollection.props[key]);
                matches.push(matchesCollection.props[key])
            }
        });
    }

    console.log("SearchItem matches ", matches.length)

    const jsonContent = JSON.stringify(matches);

    res.send(jsonContent)
}

const crawlSearchMatchesbySearchItem = async (searchItemObj) => {
    selector = {
        query: searchItemObj.query,
        priceMin: searchItemObj.priceMin,
        priceMax: searchItemObj.priceMax,
        category: searchItemObj.category,
        first: 10
    }
    
    findings = await crawlerController.scrapData ("sellingPlatforms", selector)

    if (searchItemObj.tags !== ""){
        searchItemObj.tags.split(",").forEach(tag =>{
            findings = findings.filter(finding => !finding.title.includes(tag.trim()));
        })
    }

    findings = findings.map(obj => ({ ...obj, searchItem: searchItemObj.id}))
    await searchMatchCollection.set(searchItemObj.id, findings)
    
    return {foundCount: findings.length, hasUpdate: true}
    
}

 const scrap = async (req, res, next) => {

    //Coop
    //findings = await scrapData("https://www.coop.ch/de/lebensmittel/milchprodukte-eier/butter-margarine/kochbutter-bratfett/die-butter-moedeli/p/3081185", scrapModels.coop,'.gsfi')

    selector = {
        query: "Iphone 13 Pro",
        priceMin: 500,
        priceMax: 900,
        category: "cellPhones",
        first: 5
    }

    findings = await crawlerController.scrapData ("sellingPlatforms", selector)


    const jsonContent = JSON.stringify(findings);

    res.send(jsonContent)
}

const showAllSearchMatches = async (req, res, next) => {
    searchMatches = await searchMatchCollection.list()
    detailSearchMatches = []
    await Promise.all(searchMatches.results.map(async match => {
        sMObject = await searchMatchCollection.get(match.key)
        detailSearchMatches.push(sMObject)
    }))
    const jsonContent = JSON.stringify(detailSearchMatches);

    res.send(jsonContent)
}

const deleteAllSearchMatches = async (req, res, next) => {
    searchMatches = await searchMatchCollection.list()

    searchMatches.results.forEach(match =>{
        searchMatchCollection.delete(match.key);
    })

    res.send("Deleted All Search Matches")
}



module.exports = {
    scrap,
    getSearchItemMatchesbySearchItem,
    crawlSearchMatchesbySearchItem,
    showAllSearchMatches,
    deleteAllSearchMatches
}