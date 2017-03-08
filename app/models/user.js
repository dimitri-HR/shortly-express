var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  initialize: function() {
    // 'creating' is a lifecycle (from bookshelf js) to interract with db
    this.on('creating', this.hashPassword);
  },
  comparePassword: function (password, callback) {
    bcrypt.compare(password, this.get('password'), function (err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function() {
  var cipher = Promise.promisify(bcrypt.hash);
  // bookshelf will wait for the promise to resolve before completing create action
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.set('password', hash);
    });
  }
});

module.exports = User;
