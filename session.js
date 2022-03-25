var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser'); //node js ch82
var cookieParser = require('cookie-parser');
var mysql = require('mysql'); // mysql 
var session = require('express-session')


app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
//增加靜態檔案的路徑
app.use(express.static('public'))

//==================================Sesssion setup============================
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  cookie:{
    path: '/',  
    
    }
}))
//==================================Sesssion setup============================

// add body-parser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser()) //use cookieParser

app.use(function(req,res,next){

    console.log('有人連線');
    next();
}) // middleware to check user connect 

app.get('/', function(req, res, next) {
    res.render('session', { 
      userName: req.session.username,
      email: req.session.email
     });
});

app.post('/',function(req,res){
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    res.redirect('/');
})

app.get('/login',function(req,res){
    
    console.log("session= ",req.session.email);

    //req.session.username = 'Bob' ;
    
    res.render('login');
}) // this for nodejs for ch82 body parser router



// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);