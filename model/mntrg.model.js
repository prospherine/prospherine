const mongoose = require('mongoose')

const mntrgSchema = new mongoose.Schema({
    dvcid:{
        type:String,
        required: true
    },
    temp:{
        type:Array,
        required:true
    },
    humidity:{
        type:Array,
        required:true
    },
    light:{
        type:Array,
        required:true
    },
    avgtemp:{
        type:Number,
        required:true
    },
    avghumidity:{
        type:Number,
        required:true
    },
    avglight:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    minutes:{
        type:Boolean,
        required:true
    },
    hours:{
        type:Boolean,
        required:true
    },
    days:{
        type:Boolean,
        required:true
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model('Mntrg', mntrgSchema)
