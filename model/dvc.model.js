const mongoose = require('mongoose')

const dvcSchema = new mongoose.Schema({
    dvcid:{
        type:String,
        required: true
    },
    name:{
        type:Array,
        required: true
    },
    icon:{
        type:Array,
        required: true
    },
    support:{
        type:Array,
        required: true
    },
    display:{
        type:Array,
        required: true
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model('Dvc', dvcSchema)
