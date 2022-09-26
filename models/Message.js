const { Schema, model} = require('mongoose');


const message = new Schema({
    sender: String,
    professor: String,
    content: String,

})

module.exports = model('message', message)