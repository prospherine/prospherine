const mongoose = require('mongoose')

const actSchema = new mongoose.Schema({
    dvcid:{
        type:String,
        required: true
    },
    auto:{
        type:Boolean,
        required: true
    },
    pump:{
        type:Boolean,
        required: true
    },
    lamp:{
        type:Boolean,
        required: true
    }
})

module.exports = mongoose.model('Act', actSchema)
