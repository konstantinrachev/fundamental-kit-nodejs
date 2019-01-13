var createError = require('http-errors');
var express = require('express');
var path = require('path');
var csurf = require('csurf');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const helmet = require('helmet');

const csrfMiddleware = csurf({
  cookie: true
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/pi', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

require('./database/contentType');
require('./database/content');

const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var clientRouter = require('./routes/client');

var app = express();
server.applyMiddleware({ app });

// view engine setup
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views/admin'),
  path.join(__dirname, 'views/admin/content-types'),
  path.join(__dirname, 'views/admin/content'), 
  path.join(__dirname, 'views/admin/forms'),
  path.join(__dirname, 'views/admin/templates'),
  path.join(__dirname, 'views/admin/users'),
  path.join(__dirname, 'views/admin/pages'),
  path.join(__dirname, 'views/admin/navigation'),
  path.join(__dirname, 'views/admin/partials')
]);
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(helmet());

passport.use(new LocalStrategy(
  function (email, password, done) {
    User.findOne({
      email: email
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect email.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }
));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/zulu', adminRouter);
app.use('/client', clientRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = app;
