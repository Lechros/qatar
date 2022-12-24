var express = require('express');
const { getDataByScrap, saveToAtlas, getFromAtlas } = require('../crawl');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    getFromAtlas()
        .then((data) => {
            res.json(data);
        })
});

module.exports = router;
