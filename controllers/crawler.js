const uuid4 = require("uuid4");
const axios = require('axios');
const cheerio = require("cheerio");
const crawlstructure = require("../crawlstructure");

//const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const selectRandom = () => {
   
    var randomNumber = Math.floor(Math.random() * crawlstructure.userAgents.length);
    return crawlstructure.userAgents[randomNumber];
}

let user_agent = selectRandom();
let headers = {
    "User-Agent": `${user_agent}`
}

const scrapData = async (crawlTopic, selector) => {
    let findings = [];

    await Promise.all(crawlstructure.crawlTopics[crawlTopic].map(async platform => {

        if (platform.isActive){

            let crawlModel = platform.model

            try {
                let response = ""        
                let body = null
                let headers = null
        
                switch (crawlModel.type) {
                    case "html":
                        response = await axios.get(url, headers)
                        $ = cheerio.load(response.data)
        
                        $(crawlModel.type).each((i, el) => {
                            finding = {}
                            crawlModel.attributes.forEach(function (element) {
                                finding[element.name] = $(el).find(element.path).text().trim()
                            });
                            finding["platform"] = platform.name
                            findings.push(finding)

                        })
                        break
                    case "json":
                        urlSuffix = ""
                        if (platform.key == 'tutti'){
                            headers = {
                                headers: {
                                    "content-type": "application/json",
                                    "x-tutti-client-identifier": "web/1.0.0+env-live.git-57f841b",
                                    "x-tutti-hash": uuid4(),
                                    "user-agent": selectRandom()
                                }
                            }
                            body = { 'query': "query SearchListings($query: String, $constraints: ListingSearchConstraints, $category: ID, $first: Int!, $offset: Int!, $sort: ListingSortMode!, $direction: SortDirection!) {  searchListingsByQuery(    query: $query    constraints: $constraints    category: $category  ) {    ...searchResultFields  }}fragment searchResultFields on ListingSearchResult {  listings(first: $first, offset: $offset, sort: $sort, direction: $direction) {    ...listingsConnectionField  }  galleryListings(first: 3) {    ...listingFields  }  filters {    ...filterFields  }  suggestedCategories {    ...suggestedCategoryFields  }  selectedCategory {    ...selectedCategoryFields  }  seoInformation {    seoIndexable    deQuerySlug: querySlug(language: DE)    frQuerySlug: querySlug(language: FR)    itQuerySlug: querySlug(language: IT)    bottomSEOLinks {      label      slug      searchToken    }  }  searchToken  query}fragment listingsConnectionField on ListingsConnection {  totalCount  edges {    node {      ...listingFields    }  }  placements {    keyValues {      key      value    }    pageName    pagePath    positions {      adUnitID      mobile      position      positionType    }    afs {      customChannelID      styleID      adUnits {        adUnitID        mobile      }    }  }}fragment listingFields on Listing {  listingID  title  body  postcodeInformation {    postcode    locationName    canton {      shortName      name    }  }  timestamp  formattedPrice  formattedSource  highlighted  sellerInfo {    alias    logo {      rendition {        src      }    }  }  images(first: 15) {    __typename  }  thumbnail {    normalRendition: rendition(width: 235, height: 167) {      src    }    retinaRendition: rendition(width: 470, height: 334) {      src    }  }  seoInformation {    deSlug: slug(language: DE)    frSlug: slug(language: FR)    itSlug: slug(language: IT)  }}fragment filterFields on ListingFilter {  __typename  ...nonGroupFilterFields}fragment nonGroupFilterFields on ListingFilter {  ...filterDescriptionFields  ... on ListingIntervalFilter {    ...intervalFilterFields  }  ... on ListingSingleSelectFilter {    ...singleSelectFilterFields  }  ... on ListingMultiSelectFilter {    ...multiSelectFilterFields  }  ... on ListingPricingFilter {    ...pricingFilterFields  }  ... on ListingLocationFilter {    ...locationFilterFields  }}fragment filterDescriptionFields on ListingsFilterDescription {  name  label  disabled}fragment intervalFilterFields on ListingIntervalFilter {  ...filterDescriptionFields  intervalType {    __typename    ... on ListingIntervalTypeText {      ...intervalTypeTextFields    }    ... on ListingIntervalTypeSlider {      ...intervalTypeSliderFields    }  }  intervalValue: value {    min    max  }  step  unit  minField {    placeholder  }  maxField {    placeholder  }}fragment intervalTypeTextFields on ListingIntervalTypeText {  minLimit  maxLimit}fragment intervalTypeSliderFields on ListingIntervalTypeSlider {  sliderStart: minLimit  sliderEnd: maxLimit}fragment singleSelectFilterFields on ListingSingleSelectFilter {  ...filterDescriptionFields  ...selectFilterFields  selectedOption: value}fragment selectFilterFields on ListingSelectFilter {  options {    ...selectOptionFields  }  placeholder  inline}fragment selectOptionFields on ListingSelectOption {  value  label}fragment multiSelectFilterFields on ListingMultiSelectFilter {  ...filterDescriptionFields  ...selectFilterFields  selectedOptions: values}fragment pricingFilterFields on ListingPricingFilter {  ...filterDescriptionFields  pricingValue: value {    min    max    freeOnly  }  minField {    placeholder  }  maxField {    placeholder  }}fragment locationFilterFields on ListingLocationFilter {  ...filterDescriptionFields  value {    radius    selectedLocalities {      ...localityFields    }  }}fragment localityFields on Locality {  localityID  name  localityType}fragment suggestedCategoryFields on Category {  categoryID  label  searchToken  mainImage {    rendition(width: 300) {      src    }  }}fragment selectedCategoryFields on Category {  categoryID  label  ...categoryParent}fragment categoryParent on Category {  parent {    categoryID    label    parent {      categoryID      label      parent {        categoryID        label      }    }  }}", 
                            "variables": {
                                "query": selector.query
                                , "constraints": {
                                    "strings": [{
                                        "key": "organic"
                                        , "value": ["tutti"]
                                    }]
                                    , "prices": [{
                                        "key": "price"
                                        , "min": selector.priceMin
                                        , "max": selector.priceMax
                                        , "freeOnly": false
                                    }]
                                    , "intervals": null
                                    , "locations": null
                                }
                                , "category": selector.category
                                , "first": selector.first
                                , "offset": 0
                                , "direction": "DESCENDING"
                                , "sort": "TIMESTAMP"
                            } }
                        }else if (platform.key == 'anibis') {
                            params =  {
                                "aral": `834_${selector.priceMin}_${selector.priceMax}`,
                                "cun": "alle-kategorien",
                                "fcun": "alle-kategorien",
                                "fts": selector.query,
                                "ps": selector.first,
                                "pi": 1
                            }
            
                            headers = {
                                headers: {
                                    "user-agent": selectRandom()
                                }
                            }
                            urlSuffix += "?" + new URLSearchParams(params).toString()
                        }
                        
                        response = await axios[crawlModel.method](crawlModel.url + urlSuffix, body, headers)
                
                        edges = deepFind(response.data, crawlModel.prePath)

                        if((typeof edges) !== 'undefined'){
                            edges.forEach(element => {
                                finding = {}
                                crawlModel.attributes.forEach(function (attribute_element) {
                                    switch (attribute_element.type){
                                        case "text":
                                            prefix = (typeof attribute_element.prefix) !== "undefined" ? attribute_element.prefix : ""
                                            finding[attribute_element.name] =  prefix + deepFind(element, attribute_element.path)
                                        break;
                                        case "uuid":
                                            finding[attribute_element.name] = uuid4()
                                        break;
                                    }
                                });
                                finding["platform"] = platform.name
                                findings.push(finding)
                            })
                        }
                    break;
        
                    case "ricardo":
                        //https://www.ricardo.ch/api/mfa/search/iphone%2013%20pro?range_filters.price.min=477&onlySrpState=true&originalUrl=%2Fde%2Fs%2Fiphone+13+pro%3Frange_filters.price.min%3D477
                    
                    break;
        
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    }))

    return findings;
    
}

const deepFind = (obj, path) => {
    var paths = path.split('.')
      , current = obj
      , i;

    for (i = 0; i < paths.length; ++i) {
      if (current[paths[i]] == undefined) {
        return undefined;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
  }

module.exports = {
    scrapData
}