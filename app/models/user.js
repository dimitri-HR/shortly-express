var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var User = db.Model.extend({
  tableName: 'users',
  clicks: function() {
    return this.hasMany(Link);
  },
  initialize: function() {
    var self = this;
    bcrypt.hash(this.get('password'), null, null, function (err, hash) {
      console.log('this', self);
      self.set('password', hash);
      //console.log(hash);
    });
    //this.on('creating', this.hash);
      // var shasum = crypto.createHash('sha1');
      // shasum.update(model.get('url'));
      // model.set('code', shasum.digest('hex').slice(0, 5));
  },
  hash: function () {


    // bcrypt.hash(this.get('password'), null, null, function (err, hash) {
    //   console.log('this', self);
    //   self.set('password', 'hash');
    //   //console.log(hash);
    // });
    // bcrypt.hash(this.get('password'), null, null, function (err, hash) {
    //   self.set('password', hash);
    // });
  }

});


// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });



// Generate a salt
// var salt = bcrypt.genSaltSync(10);
// // Hash the password with the salt
// var hash = bcrypt.hashSync("my password", salt);
//
// bcrypt.compareSync("my password", hash);


// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   clicks: function() {
//     return this.hasMany(Click);
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }



module.exports = User;
