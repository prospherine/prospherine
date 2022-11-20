const mongoose = require('mongoose')

const stgSchema = new mongoose.Schema({
    dvcid:{
        type:String,
        required: true
    },
    temp:{
        type:Array,
        required: true
    },
    humidity:{
        type:Array,
        required: true
    },
    light:{
        type:Array,
        required: true
    },
},
{
    timestamps:true
}
)

module.exports = mongoose.model('Stg', stgSchema)
