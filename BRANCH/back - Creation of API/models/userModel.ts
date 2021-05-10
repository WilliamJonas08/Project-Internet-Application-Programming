//const mongoose = require('mongoose');

//const userModel = mongoose.Schema({
  //firstname: { type: String, required: true },
  //surname: { type: String, required: true },
  //mail: { type: String, required: true },
//});

//module.exports = mongoose.model('User', userModel);
//module.exports = { userModel };

export class userModel {
  firstname: string;
  surname: string;
  mail: string
}