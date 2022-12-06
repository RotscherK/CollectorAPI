const express = require('express');
const searchItem = require('../controllers/searchItem');
const searchMatch = require('../controllers/searchMatch');
const router = new express.Router();

router.get('/scrap', async (req, res, next) => {searchMatch.scrap(req,res,next)})
router.post('/getSearchItemMatchesbySearchItem', async (req, res, next) => {searchMatch.getSearchItemMatchesbySearchItem(req,res,next)})
router.get('/showAllSearchMatches', async (req, res, next) => {searchMatch.showAllSearchMatches(req,res,next)})
router.get('/deleteAllSearchMatches', async (req, res, next) => {searchMatch.deleteAllSearchMatches(req,res,next)})

router.post('/getUpdateSearchItems', async (req, res, next) => {searchItem.getUpdateSearchItems(req,res,next)})
router.post('/addUpdateSearchItems', async (req, res, next) => {searchItem.addUpdateSearchItems(req,res,next)})
router.post('/scrapSearchItem', async (req, res, next) => {searchItem.scrapSearchItem(req,res,next)})
router.post('/rescrapSearchItem', async (req, res, next) => {searchItem.rescrapSearchItem(req,res,next)})
router.get('/showAllSearchItems', async (req, res, next) => {searchItem.showAllSearchItems(req,res,next)})
router.get('/deleteAllSearchItems', async (req, res, next) => {searchItem.deleteAllSearchItems(req,res,next)})

module.exports = router;