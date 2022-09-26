const { Schema, model} = require('mongoose');


const Professor = new Schema({
    mail: String,
    name: String,
    password: String,
    role: String

})

module.exports = model('Professor', Professor)