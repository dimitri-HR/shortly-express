var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');


var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


// TODO: check if user logged in

// app.use(function(req, res, next) {
//   var isit = util.isLoggedIn(req, res);
//   console.log('isit', isit);
//   console.log('isit', isit);
//   console.log('DIMA', req.url);
//   next()
// });


app.get('/',
function(req, res) {
  res.render('index');
});

app.get('/create',
function(req, res) {
  res.render('index');
});

app.get('/links',
function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.status(200).send(links.models);
  });
});

app.post('/links',
function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.status(200).send(found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }

        Links.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        })
        .then(function(newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/
app.get('/login',
function(req, res) {
  res.render('login');
});
//use post to request username and password
  //create new user for redirect if not exist and then something with password if does exists
// app.post('/login', function(req, res) {
//    console.log(req.body.username)
//    var username = req.body.username;
//    var password = req.body.password;
//
//    new User({ username: username })
//      .fetch()
//      .then(function(user) {
//       if (!user) {
//         res.redirect('/login');
//       } else {
//         bcrypt.compareSync(password, user.get('password'))
//       }
//      })
// });

app.post('/login', function(req, res) {
   //console.log(req.body.username)
   //console.log(req.body.password)
   var username = req.body.username;
   var password = req.body.password;

  //  var obj = db.knex('users').where('password', '=', 'Phillip')
  //  var obj = db.knex('users').where('username', '=', 'Phillip222').select('username')
  User.query('where', 'username', '=', username).fetch().then(function (user) {
    console.log('username', username);
    console.log('password', password);

    console.log('user', user);
    // console.log("user.get('password')", user.get('password'));

    // console.log('match =', match);

    // var test = bcrypt.compareSync(password, password);
    // console.log('test', test);

     bcrypt.compare(password, user.get('password'), function(err, match) {
       console.log('res -->>', match);
       console.log('err -->>', err);

       if (match) {
         res.redirect('/links');
       }
     });

  })
  .catch(function (err) {
    res.redirect('/signup');
    console.log('Error', err);
  });

  //  new User({ username: username })
  //    .then(function(user) {

      // if (!user) {
      //   res.redirect('/login');
      // } else {
      //   bcrypt.compareSync(password, user.get('password'))
      // }
     //})
});



// {
//   username: 'Mike'
//   password: ######
// }


// user: Mike
// password: mypassword -> ######

// query db, check if Mike has same hash in db ==


//logut for redirect to index or login
app.get('/signup',
function(req, res) {
  res.render('signup');
});

//create new user for redirect if user exists to login if not
//use a function to create a new user with password

/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        linkId: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits') + 1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

module.exports = app;
