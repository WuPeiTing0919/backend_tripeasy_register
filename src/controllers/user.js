const bcrypt = require('bcrypt');
const resStatus = require('../utils/resStatus');
const { pool } = require('../config/database');

// [POST] 使用者註冊
async function post_UserRegistration(req, res, next){
    try{
        const {name,email,password, preference} = req.body;

        const salt = await bcrypt.genSalt(10);
        const databasePassword = await bcrypt.hash(password, salt);
        // 上傳數據
        const result = await pool.query(
            'INSERT INTO public."user" (name, email, role, password, preference1, preference2, preference3) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, email, "User", databasePassword, preference[0], preference[1], preference[2] ]
          );

        // [HTTP 201] 呈現上傳後資料
        resStatus({
            res:res,
            status:201,
            dbdata:{ 
                users: {
                    id : result.rows[0].id,
                    name : result.rows[0].name
                }
            }
        });
       
    }catch(error){
        // [HTTP 500] 伺服器異常
        console.error('❌ 伺服器內部錯誤:', error);
        next(error);
    }

}

module.exports = {
    post_UserRegistration
}