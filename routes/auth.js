var express = require('express');
var router = express.Router();

const db = require("../models");
const User = db.user;
const userSchema = require("../utils/joiUserSchema");

const passport = require('passport');
const bcrypt = require('bcryptjs');


//GET request
router.get("/sign-up", (req,res)=> {
    res.redirect("/auth/sign-up/select");
});

router.get("/sign-up/select", (req,res)=> {
    res.render('sign-up/select');
});

router.get('/sign-up/form', (req, res) => {
    //ut = user type
    let userType = req.query.ut;

    if(!userType || (userType !== "student" && userType !== "business")) {
        return res.redirect("/auth/sign-up/select");
    }

    res.render('sign-up/form', { userType });
});

router.get("/sign-up/activate", (req,res)=> {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/sign-in");
    }
    //if already activated
    if (req.user.isActivated) {
        return res.redirect("/home");
    }

    res.render('sign-up/activate');
});
router.get("/sign-in", (req,res)=> {
    //if already logged in
    if (req.isAuthenticated()) {
        return res.location(req.get("Referrer") || "/");
    }

    res.render('sign-in');
});

router.get('/sign-out', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/home");
    });
});

//post
router.post("/sign-in", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            return res.status(200).json({ message: '로그인 성공' });
        });
    })(req, res, next);
});

router.post("/register", async (req,res)=>{

    //userType: student business 둘다 아니면 빠꾸
    const userType = req.body.userType;
    if(userType !== "student" && userType !== "business") {
        return res.status(400).json({ message: "잘못된 사용자 유형입니다." });
    }


    let data = req.body.data;

    let schema = (userType === "student") ? userSchema.studentSchema : userSchema.businessSchema;

    //validate
    let { error } = schema.validate(data);

    if(error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // id 중복 확인 ( mongoose)
    const user = await User.findOne({id: data.id});
    if(user) {
        return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
    }
    const password = bcrypt.hashSync(data.password, 10);

    //trim
    data.id = data.id.trim();
    data.username = data.username.trim();

    let userData = {
        id: data.id,
        username: data.username,
        password: password,
        role: (userType === "student") ? "student" : "business"
    };

    if (userType === "student") {
        userData.studentId = data.studentId;
        userData.name = data.name;
    }

    const newUser = new User(userData);

    try {
        //test
        const savedUser = await newUser.save();
        //로그인 시켜주기
        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.status(201).json({
                message: "회원가입 성공",
                isActivated: savedUser.isActivated,
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }

});

// Check for duplicate ID
router.post("/check-id", async (req, res) => {
    try {
        const user = await User.findOne({id: req.body.id });
        if (user) {
            return res.status(409).json({ error: "이미 존재하는 아이디입니다." });
        }
        res.status(200).json({ message: "사용 가능한 아이디입니다." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
