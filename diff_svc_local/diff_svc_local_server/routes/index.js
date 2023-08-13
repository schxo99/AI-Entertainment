var express = require('express');
var router = express.Router();
const pool = require("../middleware/db");

router.get('/', async(req,res) => {
  try{
    
    res.send("index")
  }catch(err){
    console.log(err)
  }
})

module.exports = router;