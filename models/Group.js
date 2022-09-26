const { Schema, model} = require('mongoose');


const Group = new Schema({
    name: String,
    mail: String,
    Students: Array

})

module.exports = model('group', Group)