const router = require('express').Router()
const Mntrg = require('../model/mntrg.model')


//get the all mntrg
// Read all mntrg
router.get('/', async(req, res)=>{
    try {
        const mntrg = await Mntrg.find({},{_id :0, __v:0, createdAt:0, updatedAt:0}).sort({createdAt:-1})
        res.status(200).json(mntrg)
    } catch (error) {
        res.status(500).json(error)
    }
})


// Read latest mntrg
router.get('/latest/:device/:limit', async(req, res)=>{
    try {
        const mntrg = await Mntrg.find({ dvcid: req.params.device },{_id :0, __v:0, createdAt:0, updatedAt:0}).limit(req.params.limit).sort({createdAt:-1})
        res.status(200).json(mntrg)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Read between
router.get('/range/:device/:start/:end', async(req, res)=>{
    try {
        const mntrg = await Mntrg.find({
            dvcid: req.params.device,
            createdAt: {
                $gte: ISODate(req.params.start),
                $lt: ISODate(req.params.end)
            }
        },{_id :0, __v:0, createdAt:0, updatedAt:0}).sort({createdAt:-1})
        res.status(200).json(mntrg)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Read specific mntrg
router.get('/:device/:limit/:range/:date', async(req, res)=>{
    try {
      if(req.params.range == "minutes"){
        const mntrg = await Mntrg.find({ dvcid: req.params.device, minutes: true, date: req.params.date }, {_id: 0, __iv:0}).limit(req.params.limit).sort({createdAt:-1})
        res.status(200).json(mntrg)
      }
      else if(req.params.range == "hours"){
        const mntrg = await Mntrg.find({ dvcid: req.params.device, hours: true, date: req.params.date }, {_id: 0, __iv:0}).limit(req.params.limit).sort({createdAt:-1})
        res.status(200).json(mntrg)
      }
      else if(req.params.range == "days"){
        const mntrg = await Mntrg.find({ dvcid: req.params.device, days: true, date: req.params.date }, {_id: 0, __iv:0}).limit(req.params.limit).sort({createdAt:-1})
        res.status(200).json(mntrg)
      }
      else{
        const mntrg = await Mntrg.find({ dvcid: req.params.device, date: req.params.date }, {_id: 0, __iv:0}).limit(req.params.limit).sort({createdAt:-1})
        res.status(200).json(mntrg)
      }
    } catch (error) {
        res.status(500).json(error)
    }
})
// router.get('/:dvc/:date', async(req, res)=>{
//     try {
//         const dateparam = req.params.date;
//         const mntrg = await Mntrg.find({dvc:req.params.dvc, createdAt: /.*dateparam.*/})
//         res.status(200).json(mntrg)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

//create new mntrg
function generateRandomFloatInRange(min, max, length) {
    let result = [];
    for(let i=0; i<length; i++){
        let val = (Math.random() * (max - min + 1)) + min;
        result.push(parseFloat(val.toFixed(2)));
    }
    return result;
}
router.post('/new/:type', async(req, res)=>{
    //Get Current Datetime
    // var today = new Date();
    // var sec = String(today.getSeconds()).padStart(2, '0');
    // var min = String(today.getMinutes()).padStart(2, '0');
    // var hr = String(today.getHours()).padStart(2, '0');
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();

    // var currentDate = dd + "-" + mm + "-" + yyyy;
    // var currentTime = hr + ":" + min + ":" + sec;

    var today = new Date().toLocaleString("id-ID", {timeZone: "Asia/Jakarta"});;

    var currentDate = today.split(" ")[0].replace("/","-").replace("/","-");
    var currentTime = today.split(" ")[1].replace(".",":").replace(".",":");

    var min = currentTime.split(":")[1];
    var hr = currentTime.split(":")[0];
    var dd = currentDate.split("-")[0];

    if(req.params.type == "imported"){
      var currentDate = req.body.date;
      var currentTime = req.body.time;
    }

    var temp = [];
    var humidity = [];
    var light = [];
    if(req.params.type == "generate"){
        temp = generateRandomFloatInRange(10.00, 150.00, 6)
        humidity = generateRandomFloatInRange(10.00, 150.00, 6)
        light = generateRandomFloatInRange(10.00, 150.00, 6)
    }
    else{
        temp = req.body.temp;
        humidity = req.body.humidity;
        light = req.body.light;
    }

    //Set range
    var minutesStatus = false;
    var hoursStatus = false;
    var daysStatus = false;

    //Set Average
    var avgtemp = 0
    var divider_temp = 0;
    var avghumidity = 0;
    var divider_humidity = 0;
    var avglight = 0;
    var divider_light = 0;
    for(let i=0; i<temp.length; i++){
        if(temp[i] != null && temp[i] != NaN){
            divider_temp++;
            avgtemp += temp[i];
        }
    }
    avgtemp = parseFloat((avgtemp/divider_temp).toFixed(2));

    for(let i=0; i<humidity.length; i++){
        if(humidity[i] != null && humidity[i] != NaN){
            divider_humidity++;
            avghumidity += humidity[i];
        }
    }
    avghumidity = parseFloat((avghumidity/divider_humidity).toFixed(2));

    for(let i=0; i<light.length; i++){
        if(light[i] != null && light[i] != NaN){
            divider_light++;
            avglight += light[i];
        }
    }
    avglight = parseFloat((avglight/divider_light).toFixed(2));

    const mntrg = await Mntrg.find({dvc:req.body.dvc}).limit(1).sort({createdAt:-1})
    if(mntrg.length != 0){
      let date = mntrg[0].createdAt;
      let minutes = date.toString().split(":")[1];
      let hours = date.toString().split(":")[0].slice(-2);
      let days = date.toString().split(" ")[2];

      if(minutes != min){
        minutesStatus = true;
      }
      if(hours != hr){
        hoursStatus = true;
      }
      if(days != dd){
        daysStatus = true;
      }
    }

    const request = {
      "dvcid": req.body.dvcid,
      "temp": temp,
      "humidity": humidity,
      "light": light,
      "avgtemp": avgtemp,
      "avghumidity": avghumidity,
      "avglight": avglight,
      "date": currentDate,
      "time": currentTime,
      "minutes": minutesStatus,
      "hours": hoursStatus,
      "days": daysStatus
    }
    const newMntrg  = new Mntrg(request)
    try {
        const saveMntrg = await newMntrg.save()
        res.status(200).json(newMntrg)
    } catch (error) {
        res.status(500).json(error)
    }
})

//update the mntrg
// router.put('/:id', async(req, res)=>{
//     try {
//         const updateMntrg = await Mntrg.findByIdAndUpdate(req.params.id, { $set: req.body}, { new:true})
//         res.status(200).json(updateMntrg)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

//update the mntrg
// router.get('/length/:dvc', async(req, res)=>{
//     try {   
//         const mntrg = await Mntrg.find({dvc:req.params.dvc}).limit(1).sort({createdAt:-1})
//         res.status(200).json(mntrg.length)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

//delete the mntrg
router.get('/delete/:dvcid', async(req, res)=>{
    try {
        const mntrg = await Mntrg.deleteMany({dvc: req.params.dvcid})
        res.status(200).json({message: 'Mntrg has been deleted successfully', mntrg})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router
