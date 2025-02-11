const express = require("express");
const router = express.Router();
const createError = require('http-errors');



const db = require("../models");
const Market = db.Market;

router.get("/map-example" ,(req, res) => {
    res.render(`market/detail/kakaomap`,{
        marketId: "map-example"
    });
});
router.get("/detail/:id", async (req, res, next) => {
    const marketId = req.params.id;
    try {
        const data = await Market.findById(marketId).exec();
        if (!data) {
            // 데이터가 없으면 404 에러 발생
            return next(createError(404, "해당 상점을 찾을 수 없습니다."));
        }
        res.render("market/detail/template", {
            marketId,
            data
        });
    } catch (err) {
        next(createError(500, err.message));
    }
});
router.get("/detail/:id", async (req, res, next) => {
    const marketId = req.params.id;

    //@todo 해결해야함
    // const data = await Market.get뭐시기ById("marketId")
    const data ={};
    if(!data) {
        createError(400);
        next();
    }

    res.render(`market/detail/template`, {
        marketId,
        data
    });
});
module.exports = router;