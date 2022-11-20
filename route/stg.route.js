const router = require('express').Router()
const Stg = require('../model/stg.model')
const Usr = require('../model/usr.model')

var unauthorization = "Anda Tidak Memiliki Hak untuk Mengakses laman ini";

//get the all stg
// Read all stg
router.post('/', async(req, res)=>{
    try {
        const usr = await Usr.find({token: req.body.token}, {token:1, _id:0})
        if(usr.length != 0){
            const stg = await Stg.find({}, {_id:0, __v:0})
            res.status(200).json(stg)
        }
        else{
            res.status(401).json(unauthorization)
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

// Read specific stg
router.get('/:dvcid', async(req, res)=>{
    try {
        const stg = await Stg.find({dvcid:req.params.dvcid}, {_id:0, __v:0})
        res.status(200).json(stg)
    } catch (error) {
        res.status(500).json(error)
    }
})

//create new stg
router.post('/new', async(req, res)=>{
    const stg = await Stg.find({dvcid:req.body.dvcid},{_id :0, __v:0});
    if(stg.length == 0){
        const newStg  = new Stg(req.body)
        try {
            const saveStg = await newStg.save()
            res.status(200).json(saveStg)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(500).json("Setting Allready Exist");
    }
})

//update the stg
router.post('/update/:dvcid', async(req, res)=>{
    try {
        const updateStg = await Stg.updateOne({dvcid: req.params.dvcid}, { $set: req.body})
        res.status(200).json(updateStg)
    } catch (error) {
        res.status(500).json(error)
    }
})

//delete the stg
router.get('/delete/:dvcid', async(req, res)=>{
    try {
        const stg = await Stg.deleteOne({dvc: req.params.dvcid})
        res.status(200).json({message: 'Stg has been deleted successfully', stg})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
