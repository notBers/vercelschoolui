const { Schema, model} = require('mongoose');


const User = new Schema({
    mail: String,
    name: String,
    password: String,

})

module.exports = model('user', User)