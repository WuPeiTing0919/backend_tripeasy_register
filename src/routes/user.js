// 主要放置「使用者」相關的路由和 API
const express = require('express');

const router = express.Router();
const controller = require('../controllers/user');

// middleware 的內容
const mw = require('../middleware/user/index');
const postuserSignup = [mw.postuserSignup,mw.isvalidPassword]

// [POST] 使用者註冊
router.post('/signup',postuserSignup, controller.post_UserRegistration);

module.exports = router;