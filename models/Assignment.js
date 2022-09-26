const { Schema, model} = require('mongoose');


const Assignment = new Schema({
    name: String,
    class: String,
    description: String,
    limit: String

})

module.exports = model('Assignment', Assignment)