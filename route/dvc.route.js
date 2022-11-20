const router = require('express').Router()
const Dvc = require('../model/dvc.model')


//get the all dvc
// Read all dvc
router.get('/', async(req, res)=>{
    try {
        const dvc = await Dvc.find({},{_id :0, __v:0, createdAt:0, updatedAt:0})
        res.status(200).json(dvc)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Read specific dvc
router.get('/:dvcid', async(req, res)=>{
    try {
        const dvc = await Dvc.find({dvcid:req.params.dvcid},{_id :0, __v:0, createdAt:0, updatedAt:0})
        res.status(200).json(dvc)
    } catch (error) {
        res.status(500).json(error)
    }
})

//create new dvc
router.post('/new', async(req, res)=>{
    const dvc = await Dvc.find({dvcid:req.body.dvcid},{_id :0, __v:0});
    if(dvc.length == 0){
        const request = {
            "dvcid": req.body.dvcid,
            "name": req.body.name,
            "icon": req.body.icon,
            "support": req.body.support,
            "display": req.body.display
        }
        const newDvc = new Dvc(request)
        try {
            const saveDvc = await newDvc.save()
            res.status(200).json(saveDvc)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(500).json("Device Allready Exist")
    }
})

//update the dvc
router.post('/update/:dvcid', async(req, res)=>{
    try {
        const request = {
            "name": req.body.name,
            "icon": req.body.icon,
            "display": req.body.display,
            "support": req.body.support
        }
        const updateDvc = await Dvc.updateOne({dvcid: req.params.dvcid}, { $set: request})
        res.status(200).json(updateDvc)
    } catch (error) {
        res.status(500).json(error)
    }
})

//delete the dvc
router.get('/delete/:dvcid', async(req, res)=>{
    try {
        const dvc = await Dvc.deleteOne({dvcid:req.params.dvcid})
        res.status(200).json({message: 'Dvc has been deleted successfully', dvc})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
