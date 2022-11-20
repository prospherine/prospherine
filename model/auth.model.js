const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    userid:{
        type:String,
        required: false
    },
    keycode:{
        type:Array,
        required: false
    },
    token:{
        type:Array,
        required: false
    }
},
{
    timestamps:false
}
)

module.exports = mongoose.model('Auth', authSchema)
