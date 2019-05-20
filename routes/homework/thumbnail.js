var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
var moment = require('moment');

const defaultRes = require("../../module/utils/utils");
const statusCode = require("../../module/utils/statusCode");
const resMessage = require("../../module/utils/responseMessage");
const db = require("../../module/pool");

router.post('/', upload.single('thumbImg'), async(req, res) => {

   const insertThumbQuery = 
   'INSERT INTO thumbnail (writer, title, thumbImg,time) VALUES (?,?,?,?)';
   const insertThumbResult = await db.queryParam_Parse(insertThumbQuery, 
    [req.body.writer, req.body.title, req.file.location, moment().format('YYYY-MM-DD HH:mm:ss')]);
    

    if (!insertThumbResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.BOARD_INSERT_FAIL));
    } else { //쿼리문이 성공했을 때
  
       res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.BOARD_INSERT_SUCCESS));
    }
});

module.exports = router;