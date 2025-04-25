
const resStatus = require('../../utils/resStatus');
const mf = require("../../utils/isValid");
const { pool } = require('../../config/database');

// 公用
// [HTTP 400] 密碼填寫不完整異常
async function isvalidPassword(req, res, next){
    const {password} = req.body;

    if(mf.controlDigitalRange(password,8,16) || mf.containsLetterAndNumber(password)){
        resStatus({
        res:res,
        status:400,
        message:"密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字"
        });
        return
    }

    next();
}

// [POST] 使用者註冊
async function postuserSignup(req, res, next) {
    const {name,email,password} = req.body;

    // [HTTP 400] 資料填寫不完整異常
    const validateError_String = mf.validateFields_String({ name,email,password });
    if(validateError_String !== null
    || mf.isAlphanumericChinese(name) || mf.isValidEmail(email) || mf.isAlphanumeric(password)
    || mf.controlDigitalRange(name,2,10)){
        resStatus({
        res:res,
        status:400,
        message: validateError_String || "欄位未填寫正確"
        });
        return
    }

    // [HTTP 409] 資料重複異常
    const emailData = await pool.query('SELECT * FROM public."user" where email = $1',[email]);
    if (emailData.rows.length > 0){
        resStatus({
        res:res,
        status:409,
        message:"Email已被使用"
        });
        return;
    }

    next();
}

module.exports = {
    isvalidPassword,
    postuserSignup
}