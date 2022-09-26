const { Schema, model} = require('mongoose');


const Class = new Schema({
    name: String,
    Professor: String,
    Group: String

})

module.exports = model('class', Class)