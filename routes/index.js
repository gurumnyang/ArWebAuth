const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/index", (req, res)=> {

    const links = [
        { text: "Index", url: "/" },
        { text: "Home", url: "/home" },
        { text: "Sign In", url: "/auth/sign-in" },
        { text: "Sign Up", url: "/auth/sign-up" },
        { text: "Market List", url: "/market-list-example" },
        { text: "map-example", url: "/market/map-example" },
        { text: "fuck you", url: "/whereAmI?" }
    ];

    res.render("index", { title: "Express 아름", links: links });
});

router.get("/", (req,res)=>{
    res.redirect("/home");
})

router.get("/home", async (req,res)=>{
        res.render("home", {
        userData: req.user
    });
})
router.get("/market-list-example", (req,res)=>{
    res.render("market-list", {
        list:[

        ],
        userData: req.user
    });
});

//dev only
//노션 리디렉션
router.get("/notion", (req,res)=> {
    res.redirect("https://gurumnyang.notion.site/108dd6ad497d80e1a903fa1885e3b94e?pvs=4");
});

module.exports = router;
