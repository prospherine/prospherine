const mongoose = require('mongoose')

const usrSchema = new mongoose.Schema({
    tour:{
        type:Boolean,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    keycode:{
        type:String,
        required: true
    },
    token:{
        type: String,
        required: false
    },
    userid:{
        type:String,
        required: true
    },
    dvcs:{
        type:Array,
        required: true
    },
},
{
    timestamps:true
}
)

module.exports = mongoose.model('Usr', usrSchema)
