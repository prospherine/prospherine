const router = require('express').Router()
const Act = require('../model/act.model')


//get the all act
// Read specific act
router.get('/', async(req, res)=>{
    try {
        const act = await Act.find({}, {_id: 0, __v:0})
        res.status(200).json(act)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Read specific act
router.get('/:dvc', async(req, res)=>{
    try {
        const act = await Act.find({dvcid:req.params.dvc}, {_id: 0, __v:0})
        res.status(200).json(act)
    } catch (error) {
        res.status(500).json(error)
    }
})

//create new act
router.post('/new', async(req, res)=>{
    const act = await Act.find({dvcid:req.body.dvcid},{_id :0, __v:0});
    if(act.length == 0){
        const newAct  = new Act(req.body)
        try {
            const saveAct = await newAct.save()
            res.status(200).json(saveAct)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else{
        res.status(500).json("Actuator Allready Exist");
    }
})

//update the act
router.post('/update/:dvcid', async(req, res)=>{
    try {
        const updateAct = await Act.updateOne({dvcid: req.params.dvcid}, { $set: req.body})
        res.status(200).json(updateAct)
    } catch (error) {
        res.status(500).json(error)
    }
})

//delete the act
router.get('/delete/:dvcid', async(req, res)=>{
    try {
        const act = await Act.deleteOne({dvc: req.params.dvcid})
        res.status(200).json({message: 'Act has been deleted successfully', act})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
