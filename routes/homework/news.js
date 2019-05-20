var express = require('express');
var router = express.Router();

var moment = require('moment');

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");
router.get('/', async (req, res) => {
    const getAllThumbnailQuery = "SELECT * FROM thumbnail ORDER BY time";
    const getAllThumbnailResult = await db.queryParam_None(getAllThumbnailQuery);

    if (!getAllThumbnailResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.NEWS_SELECT_FAIL));
    } else { //쿼리문이 성공했을 때
       res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NEWS_SELECT_SUCCESS,getAllThumbnailResult));
    }
  
});
router.get('/:idx', async (req, res) => {
    const getInfoQuery = 
    "SELECT * FROM thumbnail JOIN info ON thumbnail.idx = info.infoIdx WHERE thumbnail.idx= ?";
    const getInfoResult = await db.queryParam_Parse(getInfoQuery, [req.params.idx]);
    console.log(getInfoResult);
    var resData ={
        title:getInfoResult[0].title,
        writer:getInfoResult[0].writer,
        content:[],
        img:[],
        writetiem:getInfoResult[0].time
    }
    for(let i=0;i<getInfoResult.length;i++){
        resData.content.push(getInfoResult[i].infoContent);
        resData.img.push(getInfoResult[i].infoImg);
    }
    if (!getInfoResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.INFO_SELECT__FAIL));
    } else { //쿼리문이 성공했을 때
       res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.INFO_SELECT_SUCCESS,resData));
    }
    
});

module.exports = router;