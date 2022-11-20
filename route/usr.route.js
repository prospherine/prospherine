//Checking the crypto module
const crypto = require('crypto');

const router = require('express').Router()
const Usr = require('../model/usr.model')

function hashing(val){
    var res = crypto.createHash('sha256').update(val).digest('hex');
    return res;
}

//get the all usr
// Read all usr
router.get('/', async(req, res)=>{
    try {
        const usr = await Usr.find({},{_id :0, __v:0, createdAt:0, updatedAt:0})
        res.status(200).json(usr)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Auth
router.post('/auth', async(req, res)=>{
    var keycode = hashing(req.body.keycode);
    var result = {
        "code": 0,
        "message": "error"
    };
    try {
        const usr = await Usr.find({userid:req.body.userid},{keycode: 1, token:1, userid:1, name:1, tour:1, _id:0})

        if(usr.length != 0){
            if(keycode == usr[0].keycode){
                result = {
                    "code": 1,
                    "message": "success",
                    "userid": usr[0].userid,
                    "name": usr[0].name,
                    "token": usr[0].token,
                    "tour": usr[0].tour
                }
                //Create Token
            }
            else{
                result = {
                    "code": 0,
                    "message": "uncompatible"
                }
            }
        }
        else{
            result = {
                    "code": 0,
                    "message": "notfound"
                }
        }

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Read specific usr
router.get('/:userid', async(req, res)=>{
    try {
        const usr = await Usr.find({userid:req.params.userid},{_id :0, __v:0, createdAt:0, updatedAt:0})
        res.status(200).json(usr)
    } catch (error) {
        res.status(500).json(error)
    }
})

//create new usr
router.post('/new', async(req, res)=>{
    const usr = await Usr.find({userid:req.body.userid},{_id :0, __v:0});
    if(usr.length == 0){
        //Get Current Datetime
        var today = new Date();
        var sec = String(today.getSeconds()).padStart(2, '0');
        var min = String(today.getMinutes()).padStart(2, '0');
        var hr = String(today.getHours()).padStart(2, '0');
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = String(today.getFullYear());

        var currentDate = dd + "-" + mm + "-" + yyyy;
        var currentTime = hr + ":" + min + ":" + sec;

        let user = req.body.userid;
        let token = hashing(user+"."+currentDate+"T"+currentTime);
        var keycode = hashing(req.body.keycode)
        const request = {
            "tour": true,
            "name": req.body.name,
            "userid": user,
            "token": token,
            "keycode": keycode,
            "dvcs": req.body.dvcs
        }
        const newUsr  = new Usr(request)
        try {
            const saveUsr = await newUsr.save()
            res.status(200).json(saveUsr)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(500).json("User Allready Exist")
    }
})

//update the usr
router.post('/update/:userid', async(req, res)=>{
    try {
        var keycode = hashing(req.body.keycode)
        const request = {
            "tour": req.body.tour,
            "name": req.body.name,
            "keycode": keycode,
            "dvcs": req.body.dvcs
        }
        const updateUsr = await Usr.updateOne({userid: req.params.userid}, { $set: request})
        res.status(200).json(updateUsr)
    } catch (error) {
        res.status(500).json(error)
    }
})

//update the tour
router.post('/tour/:userid', async(req, res)=>{
    try {
        const request = {
            "tour": req.body.tour
        }
        const updateUsr = await Usr.updateOne({userid: req.params.userid}, { $set: request})
        res.status(200).json(updateUsr)
    } catch (error) {
        res.status(500).json(error)
    }
})

//delete the usr
router.get('/delete/:userid', async(req, res)=>{
    try {
        const usr = await Usr.deleteOne({userid:req.params.userid})
        res.status(200).json({message: 'Usr has been deleted successfully', usr})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
