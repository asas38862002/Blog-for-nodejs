var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser'); //node js ch82
var cookieParser = require('cookie-parser');
var mysql = require('mysql'); // mysql 
var session = require('express-session')

//============================upload==================================
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require("fs")
//============================upload=================================

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
  saveUninitialized: true,
  cookie:{
    path: '/',   
    //maxAge: 100*1000
    }
}));
app.use(bodyParser.json({
    limit: '50mb'
  }));
  
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
}));
//==================================Sesssion setup============================

// add body-parser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser()) //use cookieParser

app.use(function(req,res,next){


    //req.session.account  = '2222@123';
    //req.session.username = '1111'; 

    //req.session.account  = '123@111';
    //req.session.username = '2222';

    //console.log("req.session.username",req.session.username);   
    console.log('有人連線');
    next();
}) // middleware to check user connect 

//路由
app.get('/',function(req,res){
    console.log("cookie= ",req.cookies); //test output cookie value
    console.log("session= ",req.session); //
    console.log("sessionid= ",req.sessionID); //test output cookie value
    //req.session.email = "test" ;
    console.log('output= ',req.session.email);
    res.render('index');

}) // test localhost router

app.get('/user',function(req,res){
    res.render('user');
}) // router test 


app.get('/test/:name/:number',function(req,res){
    var temp = req.params ;
    console.log(temp);
    res.render('index');
}) //test : http://localhost:3000/test/Jax/123456

app.get('/testget/:name',function(req,res){
    var temp = req.query.user ;
    var number = req.query.number ;
    //qwe(); // this is test 500 appliction error
    console.log('num= ',temp,'number= ',number);
    res.render('index');
    //test : http://localhost:3000/testget/Jax?user=Bob&number=1234
}) // router get url?/user=&number

app.get('/testejs',function(req,res){
    res.render('user',{
        'tittle':'<h1>測試HTML</h1>',
        'boss'  :'Jax',
        'show'  : true,
        'array' :['html','js','bs','php'], //test array to html
    });
}) // test Ejs input parameter to user Ejs <% %> from nodejs that is ch. 76

app.get('/search',function(req,res){
    res.render('search');
}) // this for nodejs for ch82 body parser router

app.post('/searchList',function(req,res){
    console.log(req.body.searchText);

    res.redirect('search') // node js for ch83
}) // this for nodejs for ch82 body parser router


//==================================upper is teach for udemy=====================



//=============================upload============================================

/*app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    const { bytes, fileName } = req.body;

    const filePath = `uploads/${fileName}`;
    
    const byteArray = Uint8Array.from(Object.values(bytes));
    fs.writeFileSync(filePath, byteArray, { flag: "a+" });
    console.log("upload");
    res.json({ bytes });
})

app.get('/upload',function(req,res){
    res.render('upload');
}) // this for nodejs for ch82 body parser router

app.get('/upload1',function(req,res){
    res.render('upload1');
}) // this for nodejs for ch82 body parser router*/

//=============================upload============================================

app.get('/register',function(req,res){
    res.render('register');
}) // this for nodejs for ch82 body parser router



app.post('/register_account',function(req,res){
    var email = req.body.email ;
    var name = req.body.name ;
    var pwd = req.body.password ;

    console.log('req= ',req.body.email);

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'Jax',
        password : '123456',
        database : 'hw4',
        port: 3306
    });
    var sql = 'SELECT * FROM account' ;
    connection.connect();
 
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;
      //console.log('output: ', results);
      //console.log('output: ', results.length);
      var account_flag = 0 ;
      for ( i=0 ; i < results.length ; i++ ){
            if(results[i].email == email)
            {
                account_flag = 1 ;
                
            } // check account already exist 
        }  // search mysql account 
        if(account_flag==1)
        {
            //console.log('the account is exist');
            res.send('the account is exist');
        } // if account have same server respond the account is exist 
        
        else {

            var sql1 = "INSERT INTO account (id,name, email,pwd) VALUES ('null',"+ 
            '\'' + name +'\''+','+'\''+email+'\''+','+pwd+')'  ; //mysql insert statement
            var sql2 = "INSERT INTO game (id,email,ticket,money) VALUES ('null',"+ 
            '\''+email+'\''+','+"\'"+1+"\',"+"\'"+10+"\'"+')'  ; //mysql insert statement            
            console.log(sql2) ;
            connection.query(sql1, function (err, result) {
                if (err) throw err;
                connection.query(sql2, function (err, result) {
                    if (err) throw err;  

                    

                    console.log('the account not exist');
                    res.send('註冊成功');  
                    connection.end();
                });             
                //console.log("1 record inserted");
               // res.send('註冊成功');  
            }); //mysql insert data in account table 


                // console.log('the account not exist');
                // res.send('success');    

            
        }// if account is not same server respond success and insert the account to mysql 
        
       
    });
}) //Ajax for register_account respond.



//=======================================register system==================================

app.get('/login',function(req,res){
    //console.log("login session= ",req.session);
    //console.log("session.username is = ",req.session.username);
    //req.session.username = 'Bob' ;

    res.render('login');
  
    // check your session , if you have login redirect to index 
    //console.log("login session: ",req.session);
}) // this for nodejs for ch82 body parser router

app.post('/login_account',function(req,res){

    
    var email = req.body.username ;
    var pwd = req.body.password ;
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'Jax',
        password : '123456',
        database : 'hw4',
        port: 3306
    });
    var sql = 'SELECT * FROM account' ;
    connection.connect();

    connection.query(sql, function (error, results, fields) {
      if (error) throw error;
      //console.log('output: ', results);
      //console.log('output: ', results.length);
      var account_flag = 0 ;
      for ( i=0 ; i < results.length ; i++ ){
            if(results[i].email == email && results[i].pwd ==pwd )
            {
                
                account_flag = 1 ;
                req.session.account = email ;
                req.session.username = results[i].name ;

                
                break ;
            } // The account and pwd is exist in Mysql  

            else if(results[i].email != email )
            {
                account_flag = 2 ;  
            } // The account is not exist in Mysql  

            else if(results[i].email == email && results[i].pwd !=pwd )
            {
                
                account_flag = 3 ;
                break ;
            } // The account and pwd is exist but pwd is not correct  

        }  // search mysql account 


        if(account_flag==1)
        {
            console.log('the account is match');
            //res.send('the account is match');
            //connection.end();//close mysql
            res.render('login_sign',{
                'show'  : 1,
            });
        } // if account is match respond the account is exist 
        
        else if(account_flag==2) {
            console.log('the account is not exist');
            //connection.end(); //close mysql
            res.render('login_sign',{
                'show'  : 2,
            });
        }// if account is not same server respond success and insert the account to mysql 
        
        else if(account_flag==3) {
            console.log('the pwd is wrong ');
            //connection.end(); //close mysql
            res.render('login_sign',{
                'show'  : 3,
            });
        }// if account is not same server respond success and insert the account to mysql 
    

        connection.end();
    }); //SQL function 

}) // this is login system 

//======================================login system====================================

app.get('/index',function(req,res){
    //console.log("homepage session: ",req.session); //output session

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'Jax',
        password : '123456',
        database : 'hw4',
        port: 3306 ,
        dateStrings: true,
    });
    var sql = 'SELECT article.ID,article.tittle,article.context,article.time,account.name,account.email FROM article INNER JOIN account '+ 
    'ON article.email = account.email' ;
    //console.log("sql= ",sql );
    var account = req.session.account;
    connection.connect();
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        //console.log('results= ',results);
        
        if(!req.session.account)
        {
            res.render('home',{
                'session':false,
                'item'   :results,
                
            });
        } //no session to show login and register
        else
        {
            res.render('home',{
                'session': true ,
                'item'   :results,
                'account':account,
            });
        }   //session to show logout
    
        connection.end();
    }) /* mysql query SELECT article.ID,article.tittle,article.context,article.time,account.name 
          FROM article INNER JOIN account ON article.email = account.email'*/
}) // index page 

//======================================home page system================================

app.get('/profile',function(req,res){
    var user = req.query.user ; // get query from url
    var own  = req.session.account ;
    var homepage ;
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'Jax',
        password : '123456',
        database : 'hw4',
        port: 3306,
        dateStrings: true,
    });    

    var sql = 'SELECT * FROM account where account.email = \''+user+'\'' ;
    var sql1 ='SELECT * FROM article where article.email = \''+user+'\''+'order by time desc' ;
    var sql2 ='SELECT * FROM game    where game.email = \''+user+'\'' ;
    var sql3 ='SELECT * FROM article INNER JOIN agree ON article.ID = agree.tittleid and agree.email = \''+own+'\' and article.email =\''+user+'\''+'order by article.time desc' ; //search the user agree articles . 
    var sql4 ='SELECT * FROM article INNER JOIN agree ON article.ID = agree.tittleid and article.email = \''+user+'\'';
    var sql5 ='SELECT * FROM article INNER JOIN message ON article.ID = message.tittleid and article.email = \''+user+'\''+' order by message.time desc';

    
    //console.log("sql= ",sql5) ;
    //console.log("own= ",own);
    if(!own){
        own = 777 ; 
    }

    connection.connect();
    
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        var usename = results[0] ; // get object[0].name
        //console.log("usename= ",usename); 
        //console.log(results) ;
        if (own == user)
        {
            homepage = true ;

        }
        else{
            homepage = false ;
        }
        connection.query(sql2, function (error, results, fields) {
            if (error) throw error;
 
            var game = results[0] ;
            //console.log(game) ;
        

            connection.query(sql1, function (error, results, fields) {
                if (error) throw error;
                var article = results ;
                connection.query(sql3, function (error, results, fields) {
                    if (error) throw error;
                    
                    var agree = results ;
                    //console.log(sql3) ;
                    connection.query(sql4, function (error, results, fields) {
                        if (error) throw error;
                        var agreearti = results ;
                        
                        connection.query(sql5, function (error, results, fields) {
                            if (error) throw error;
                            var message = results ;
                            
                            //console.log(results) ;
                            res.render('profile1',{
                                'home': homepage ,
                                'user': usename,
                                'game': game,
                                'article': article,
                                'agree' : agree,
                                'own'   : own ,
                                'agreearti' :agreearti,
                                'message' : message ,
                            });

                            connection.end();
                        }) //search message for user article
                            //console.log(results) ;

                          

                    })//search user profile article's agree 

                   // console.log(results)
                }) // search self agree for user's article               
  
                //console.log(results) ;
            })// article sql            

        })//game sql 
        
        //console.log("sql1= ",sql2);


        

        //connection.end();
    }) //mysql read  
//console.log("u dont have  session account : ");
    

}) // profile page


app.get('/addreply',function(req,res){
    
     var artid = req.query.artid ;  
     var reply = req.query.reply ; // get query user text 
     var username  = req.session.username; // get session user name 
     var email = req.session.account ; // get session user email 
    //console.log("req.body= ",req.query.reply);

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'Jax',
        password : '123456',
        database : 'hw4',
        port: 3306 ,
        dateStrings: true,
    });


    var sql1 = "INSERT INTO message (id,name, email,tittleid,msg,time) VALUES ('null',"+ 
    '\'' + username +'\''+','+'\''+email+'\''+','+artid+','+'\''+reply+'\''+','+'now()'+')'  ; //mysql insert message 

    var sql2 = 'SELECT * FROM message where tittleid='+artid+' order by time desc' ; //mysql insert message 
    var sql3 = 'SELECT * FROM game where email= \''+email+"\'" ;
    var sql4 = "" ;
    
    //console.log(sql3) ;
   

    connection.query(sql3, function (error, results, fields) {
            if (error) throw error;
            //console.log(results);
            var money = results[0].money ;

            if(money > 0 )
            {
                money = money - 1 ;
                sql4 = "UPDATE game SET " +"money="+'\''+money+'\''+" where email = \'"+email+"\'"  ;
                
                connection.query(sql4, function (err, result) {
                    if (err) throw err;
                    //console.log("1 record update");

                connection.query(sql1, function (err, result) {
                    if (err) throw err;
                    //console.log("1 record inserted");
    
                    connection.query(sql2, function (error, results, fields) {
                        if (error) throw error;
                        //console.log(results[0]);
    
                        var str =""; 
                        str = str + "<div class='card-comment'>";
                        str = str + "<span class=\'username\'>"
                        +username
                        +"<span class='text-muted float-right'>"+results[0].time+"</span></span>"+reply+"</div>"
                        +"</div></div>"+money;
                        
                        res.send(str); 
                        connection.end();
    
                        }); //mysql select data in message table
                    }); //mysql insert data in game table

                });
            } // if money >0 ,you have to sub 1 money
            
            else 
            {
                console.log("u dont have money");
                res.send("999"); 
            }
    }); // mysql select data in game table
    //console.log(str) ;      
    //res.send("T");

}) // message reply system 

app.get('/like',function(req,res){
    
    var artid = req.query.artid ;  
    var userid = req.query.userid ; // get query user text 
    var username  = req.session.username; // get session user name 
    var email = req.session.account ; // get session user email 
   //console.log("req.body= ",req.query.reply);

   var connection = mysql.createConnection({
       host     : 'localhost',
       user     : 'Jax',
       password : '123456',
       database : 'hw4',
       port: 3306 ,
       dateStrings: true,
   });


    var sql1 = "INSERT INTO agree (id,email,tittleid) VALUES ('null',"+'\''+email+'\''+','+artid+')'  ; //mysql insert statement

    var sql2 = 'SELECT * FROM article where ID='+artid ; //mysql ID = artid in article 
    var sql3 = 'SELECT * FROM agree where tittleid='+artid //mysql tittleid = artid in agree
    var sql4 = 'SELECT * FROM message where tittleid='+artid //mysql tittleid = artid in agree
    var sql5 = "UPDATE article SET " +"have_ticket= \'1\'"+" where id = "+artid  ;
    var str ="";
    //console.log(sql5) ;
   
   
   connection.query(sql1, function (err, result) {
       if (err) throw err;
       //console.log("1 record inserted");
       connection.query(sql2, function (error, results, fields) {
           if (error) throw error;
           //console.log(results[0]);
           var article = results[0] ;
            connection.query(sql3, function (error, results, fields) {
                if (error) throw error;
                
                var agree = results ; 
                //console.log("agree= ",agree) ;
                connection.query(sql4, function (error, results, fields) {
                    if(article.have_ticket == 0 )
                    {
                        if(agree.length>4)
                        {
                            // console.log("u get one ticket") ;
                            // console.log("email= ",article.email);  
                            var sql6 = 'SELECT * FROM game where email= \''+article.email+'\'';
                            // console.log("sql6= ",sql6);  
                            connection.query(sql6, function (error, results, fields) {
                                if (error) throw error;
                                var game = results[0] ;
                                var sql7 = "UPDATE game SET " +"ticket= "+(parseInt(game.ticket)+1)+" where email = \'"+article.email+"\'"  ;
                                
                                connection.query(sql7, function (err, result) {
                                    if (err) throw err;
                                    connection.query(sql5, function (err, result) {
                                        if (err) throw err;
                                    });// update article's have_ticket col. to 1 
                                });// update ticket number for article's user 
                            }); // get game data for article's user 
                          str = str+"T";                           
                        }//check agree count > 5  
                        
                    }//check have_ticket 
                    var message = results ;
                    //console.log(userid);
                    str =str+"<p>"+article.context+"</p>" 
                    +"<button type='button' class='btn btn-default btn-sm' onclick = \"dislike("+artid+",\'"+userid+"\',123)\">"
                    +"<i class='fas fa-thumbs-up'></i> Like</button>"
                    +"<span class='float-right text-muted' id = 'good50'>"+agree.length+" likes - "+message.length+" comments</span>"; 
        
                    res.send(str); 
                })
            })
            //console.log("artid= ",artid) ;
            //console.log("userid= ",userid) ;
        //str = "success" ;         
       }); //mysql select article.ID=? in article table

   }); //mysql insert data in message table
}) // like system

app.get('/dislike',function(req,res){
    
    var artid = req.query.artid ;  
    var userid = req.query.userid ; // get query user text 
    var username  = req.session.username; // get session user name 
    var email = req.session.account ; // get session user email 
   //console.log("req.body= ",req.query.reply);

   var connection = mysql.createConnection({
       host     : 'localhost',
       user     : 'Jax',
       password : '123456',
       database : 'hw4',
       port: 3306 ,
       dateStrings: true,
   });


    var sql1 = "Delete from agree where email = "+'\''+email+'\''+'and tittleid= '+artid  ; //mysql Delete user's agree from agree table

    var sql2 = 'SELECT * FROM article where ID='+artid ; //mysql ID = artid in article 
    var sql3 = 'SELECT * FROM agree where tittleid='+artid //mysql tittleid = artid in agree
    var sql4 = 'SELECT * FROM message where tittleid='+artid //mysql tittleid = artid in agree

    //console.log(sql1) ;
   
   
   connection.query(sql1, function (err, result) {
       if (err) throw err;
       //console.log("1 record inserted");
       connection.query(sql2, function (error, results, fields) {
           if (error) throw error;
           //console.log(results[0]);
           var article = results[0] ;
            connection.query(sql3, function (error, results, fields) {
                if (error) throw error;
                
                var agree = results ; 
                //console.log("agree= ",agree) ;
                connection.query(sql4, function (error, results, fields) {
                
                    var message = results ;
                    //console.log(userid);
                    var str ="<p>"+article.context+"</p>" 
                    +"<button type='button' class='btn btn-default btn-sm' onclick = \"like("+artid+",\'"+userid+"\')\">"
                    +"<i class='far fa-thumbs-up'></i> Like</button>"
                    +"<span class='float-right text-muted' id = 'good50'>"+agree.length+" likes - "+message.length+" comments</span>"; 
        
                    res.send(str); 
                })
            })
            //console.log("artid= ",artid) ;
            //console.log("userid= ",userid) ;
        //str = "success" ;         
       }); //mysql select article.ID=? in article table

   }); //mysql delete one agree in agree table

}) // dislike system

app.get('/addarticle',function(req,res){
    
    var tittle = req.query.title ;  
    var content = req.query.content ; // get query user text 
    var username  = req.session.username; // get session user name 
    var email = req.session.account ; // get session user email 
   //console.log("req.body= ",req.query.reply);

   var connection = mysql.createConnection({
       host     : 'localhost',
       user     : 'Jax',
       password : '123456',
       database : 'hw4',
       port: 3306 ,
       dateStrings: true,
   });
//   console.log("article= ",tittle) ;
//   console.log("context= ",content) ;


   var sql1 = "INSERT INTO article (id,email,tittle,context,time) VALUES ('null',"+ 
   '\''+email+'\''+','+'\''+tittle+'\''+','+'\''+content+'\''+','+'now()'+')'  ; //mysql insert message 
   var sql2 = 'SELECT * FROM game where email=\''+email+'\'' ;
   
/*   var sql2 = 'SELECT * FROM message where tittleid='+artid+' order by time desc' ; //mysql insert message 
*/
   console.log(sql2) ;
   
   connection.query(sql2, function (error, results, fields) {
    if (error) throw error;
        //console.log(results) ;
        var game = results[0];
        if(game.money<20)
        {
            res.send("999");
        }
        else{
            var sql3 = "UPDATE game SET " +"money="+'\''+(parseInt(game.money)-20)+'\''+" where email = \'"+email+"\'"  ;
            //console.log(sql3);
            connection.query(sql1, function (err, result) {
                if (err) throw err;
                connection.query(sql3, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.send(email);  
                })                
     
            }); //mysql insert data in message table
        }
     
    })
     
   //console.log(str) ;      
   //res.send("T");

}) // addarticle system 

app.get('/editarticle',function(req,res){
    
    var articleid = req.query.id ;  
    var username  = req.session.username; // get session user name 
    var email = req.session.account ; // get session user email 

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'Jax',
        password : '123456',
        database : 'hw4',
        port: 3306 ,
        dateStrings: true,
    });
//   console.log("article= ",tittle) ;
//   console.log("context= ",content) ;


   /*var sql1 = "INSERT INTO article (id,email,tittle,context,time) VALUES ('null',"+ 
   '\''+email+'\''+','+'\''+tittle+'\''+','+'\''+content+'\''+','+'now()'+')'  ; //mysql insert message */

   var sql1 = 'SELECT * FROM article where id='+articleid ; //mysql insert message 

   connection.query(sql1, function (error, results, fields) {
        var article = results ;
        var json =  {
            id : articleid,
            tittle : article[0].tittle,
            context : article[0].context
        };

        //console.log(article[0].tittle);
        
        res.send(json); 
    })

   //console.log(sql1) ;


    //res.json(json);
    //res.send(json);
     
}) // edit_article system 

app.get('/editupdate',function(req,res){
    
    var tittle = req.query.title ;  
    var content = req.query.content ; // get query user text 
    var articleid = req.query.id ; // get query user text 

    var username  = req.session.username; // get session user name 
    var email = req.session.account ; // get session user email 
   //console.log("req.body= ",req.query.reply);

   var connection = mysql.createConnection({
       host     : 'localhost',
       user     : 'Jax',
       password : '123456',
       database : 'hw4',
       port: 3306 ,
       dateStrings: true,
   });
//    console.log("articleid= ",articleid) ;
//    console.log("article= ",tittle) ;
//    console.log("context= ",content) ;


   var sql1 = "UPDATE article SET " +"tittle="+'\''+tittle+'\''+','+"context="+'\''+content+'\''+" where id = "+articleid  ; //mysql insert message 
   console.log(sql1); 
/*   var sql2 = 'SELECT * FROM message where tittleid='+artid+' order by time desc' ; //mysql insert message 
*/
   //console.log(sql1) ;
   

    connection.query(sql1, function (err, result) {
        if (err) throw err;
        
        console.log(result.affectedRows + " record(s) updated");
        res.send(email);
    });

    
   //console.log(str) ;      
   //res.send("T");

}) // edit_update_article system 

app.get('/deleteart',function(req,res){


    var articleid = req.query.id ; // get query user text 

    var username  = req.session.username; // get session user name 
    var email = req.session.account ; // get session user email 
   //console.log("req.body= ",req.query.reply);

   var connection = mysql.createConnection({
       host     : 'localhost',
       user     : 'Jax',
       password : '123456',
       database : 'hw4',
       port: 3306 ,
       dateStrings: true,
   });
//    console.log("articleid= ",articleid) ;
//    console.log("article= ",tittle) ;
//    console.log("context= ",content) ;


   var sql1 = "DELETE FROM article " +" where id = "+articleid  ; //mysql insert message 
   var sql2 = "DELETE FROM message " +" where tittleid = "+articleid  ; //mysql insert message 
   var sql3 = "DELETE FROM agree " +" where tittleid = "+articleid
//    console.log(sql1); 
//    console.log(sql2); 
//    console.log(sql3); 


/*   var sql2 = 'SELECT * FROM message where tittleid='+artid+' order by time desc' ; //mysql insert message 
*/
   //console.log(sql1) ;
   

    connection.query(sql1, function (err, result) {
        if (err) throw err;
        //console.log("Number of records deleted: " + result.affectedRows);
        
        connection.query(sql2, function (err, result) {
            
            //console.log("Number of records deleted: " + result.affectedRows);

            connection.query(sql3, function (err, result) {
            
                //console.log("Number of records deleted: " + result.affectedRows);
                res.send(email);
            });
                

        });

    });

    
    
   //console.log(str) ;      
   //res.send("T");

}) // delete_article system 

app.get('/lottery',function(req,res){


    var articleid = req.query.id ; // get query user text 

    var username  = req.session.username; // get session user name 
    var email = req.session.account ; // get session user email 
   //console.log("req.body= ",req.query.reply);

   var connection = mysql.createConnection({
       host     : 'localhost',
       user     : 'Jax',
       password : '123456',
       database : 'hw4',
       port: 3306 ,
       dateStrings: true,
   });
//    console.log("articleid= ",articleid) ;
//    console.log("article= ",tittle) ;
//    console.log("context= ",content) ;


   var sql1 = "Select * FROM game " +" where email = \'"+email+"\'"  ; //mysql insert message 
   //var sql2 = "Select * FROM message " +" where tittleid = "+articleid  ; //mysql insert message 
   //var sql3 = "Select * FROM agree " +" where tittleid = "+articleid ;


   
   //console.log("randnum",typeof("rstr"));


    connection.query(sql1, function (error, results, fields) {
        if (error) throw error;
        var money = Number(results[0].money) ;
        var ticket = Number(results[0].ticket) ;
        if(ticket > 0)
        {
            var randnum = Math.floor(Math.random() * 10) + 1 ;
            var json =  {
                number : randnum.toString(),
            };
            res.send(json);

            ticket = ticket - 1
            if(randnum == 2)
            {
                money += 50 ; 
            }
            if(randnum == 4)
            {
                money += 150 ; 
            }
            if(randnum == 5)
            {
                money += 500 ; 
            }
            if(randnum == 7)
            {
                money += 20 ; 
            }
            if(randnum == 9)
            {
                money += 50 ; 
            }
            if(randnum == 10)
            {
                money += 20 ; 
            }

            //console.log("money is ",money);          
            var sql2 =  "UPDATE game SET " +"ticket="+'\''+ticket+'\''+','+"money="+'\''+money+'\''+" where email = \'"+email+"\'"  ;
            connection.query(sql2, function (err, result) {
                if (err) throw err;
                
                //console.log(result.affectedRows + " record(s) updated");
                //res.send(email);
            }); //update money table
            
        }
        else {
            var json =  {
                number : "999",
            };            
            res.send(json);
        }
        
        //console.log(results) ;

    })
   
//    console.log(sql1); 
//    console.log(sql2); 
//    console.log(sql3); 

   //console.log("lottery");
/*   var sql2 = 'SELECT * FROM message where tittleid='+artid+' order by time desc' ; //mysql insert message 
*/
   //console.log(sql1) ;
   

    // connection.query(sql1, function (err, result) {
    //     if (err) throw err;
    //     //console.log("Number of records deleted: " + result.affectedRows);
        
    //     connection.query(sql2, function (err, result) {
            
    //         //console.log("Number of records deleted: " + result.affectedRows);

    //         connection.query(sql3, function (err, result) {
            
                //console.log("Number of records deleted: " + result.affectedRows);
                //console.log(str)
               
    //         });
                

    //     });

    // });

    
    
   //console.log(str) ;      
   //res.send("T");

}) // lottory system

//======================================profile system==================================

app.get('/articleshow',function(req,res){

    var articleid  = req.query.article ;
    //console.log("articleshow");
    
    
    var own  = req.session.account ;
    
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'Jax',
        password : '123456',
        database : 'hw4',
        port: 3306,
        dateStrings: true,
    });    

    
    var sql1 ='SELECT * FROM article where article.ID = \''+articleid+'\'' ;
    var sql3 ='SELECT * FROM agree where email = \''+own+'\' and tittleid= '+articleid ; //search the user agree articles . 
    var sql4 ='SELECT * FROM agree where tittleid = \''+articleid+'\'';
    var sql5 ='SELECT * FROM message where tittleid = \''+articleid+'\''+' order by message.time desc';

    
    //console.log("sql= ",sql4) ;
    //console.log("own= ",own);
    if(!own){
        own = 777 ; 
    }

    connection.connect();
    
  
        
            connection.query(sql1, function (error, results, fields) {
                if (error) throw error;
                var article = results ;
                connection.query(sql3, function (error, results, fields) {
                    if (error) throw error;
                    var agree = results ;
                    //console.log("agree= ",sql3) ;
                    connection.query(sql4, function (error, results, fields) {
                        if (error) throw error;
                        var agreearti = results ;
                       // console.log(sql4);
                        connection.query(sql5, function (error, results, fields) {
                            if (error) throw error;
                            var message = results ;
                            
                            //console.log(results) ;
                            res.render('article',{
                                
                                //'user': usename,
                                
                                'article': article,
                                'agree' : agree,
                                'own'   : own ,
                                'agreearti' :agreearti,
                                'message' : message ,
                            });

                            connection.end();
                        }) //search message for user article
                            //console.log(results) ;

                          

                    })//search user profile article's agree 

                   // console.log(results)
                }) // search self agree for user's article               
  
                //console.log(results) ;
            })// article sql            

        
        
        //console.log("sql1= ",sql2);


        

        //connection.end();
    
//console.log("u dont have  session account : ");
    

}) // profile page

 
//======================================article_show system==================================



app.get('/logout',function(req,res){
    //console.log("homepage session: ",req.session); //output session
    
    delete req.session.account
    delete req.session.username;
    res.render('logout');


}) // logout

//======================================logout system===================================



app.use(function(req,res,next){

    res.status(404).send('sorry,web is not found') ;

}) // middleware to check user connect for 71 chapter. It is web not found,show this for user. 


app.use(function(err,res,next){

    res.status(500).send('APP have problem') ;

}) // middleware application have problem for 71 chapter. It is have program problem,show this for user.





// 監聽 port
var port = process.env.PORT || 3000;
app.listen(port);