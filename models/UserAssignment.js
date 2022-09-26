const { Schema, model} = require('mongoose');


const UserAssignment = new Schema({
    name: String,
    message: String,
    link: String,
    assignment: String,
    mark: String

})

module.exports = model('UserAssignment', UserAssignment)