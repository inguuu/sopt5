var express = require('express');
var router = express.Router();
const upload = require('../../config/multer');

var moment = require('moment');
const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

router.post('/', upload.array('infoImg'), async (req, res) => {
    
    const findIdxQuery =  "SELECT * FROM thumbnail WHERE thumbnail.idx=?";
    // 등록할 info테이블의 infoIdx를 등록가능 한지 찾아주는 쿼리 
    const findIdxResult = await db.queryParam_Parse(findIdxQuery,req.body.infoIdx);
    console.log(findIdxResult);
    if(findIdxResult[0]==null){// 썸네일 번호가 없으면 실패
        res.status(200).send(defaultRes.successFalse(statusCode.NO_CONTENT, resMessage.NOT_CORRECT_THUMB_ID));
    }
    else{
        var contentSize =0;
        if(typeof(req.body.infoContent)=='string'){
            contentSize=1;
        }
        else if(typeof(req.body.infoContent)=='object'){
            contentSize=req.body.infoContent.length;
        }
        if(contentSize==req.files.length){//내용의 수와 이미지 수가 같아야만 저장 1대1
            for (let i = 0; i <contentSize; i++) {
                insertInfoQuery=
                'INSERT INTO info (infoIdx,infoImg,infoContent) VALUES (?,?,?)';
                insertInfoResult = await db.queryParam_Parse(insertInfoQuery, 
                 [req.body.infoIdx, req.files[i].location, req.body.infoContent[i]]);
            }   
            if (!insertInfoResult) {
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.INFO_INSERT_FAIL));
            } else { //쿼리문이 성공했을 때
               res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.INFO_INSERT_SUCCESS));
            }
        }else{
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_EQUAL_NUMBER));
        }
      
    }
    
});

module.exports = router;