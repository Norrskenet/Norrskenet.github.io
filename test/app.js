  
const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const blogpostsRouter = require('./blogpostsRouters');
const loginRouter = require('./loginRouters');
const expressSession = require('express-session');
const SQLiteStore = require('connect-sqlite3')(expressSession);
const cookieparser = require('cookie-parser');
const paginate = require('express-paginate');
const multer = require('multer')

const db = require('./db');

const app = express();

const upload = multer({dest: "images/"})

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(paginate.middleware(10, 50));

app.use(expressSession({
    secret: "iojasdijasijdfiajsid",
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore()
}));

app.use(cookieparser())

app.use(function(request, response, next){
	
	response.locals.isLoggedIn = request.session.isLoggedIn
	
	next()
	
});

app.use("/posts", blogpostsRouter);

app.use("/login", loginRouter);

app.engine("hbs", expressHandlebars({
	defaultLayout: "main.hbs"
}));

app.get("/", function(request,response){
    console.log('Cookies', request.cookies)
    console.log('Signed Cookies', request.signedCookies)
    response.render("home.hbs")
});

app.get("/about", function(request,response){
    response.render("about.hbs")
});

app.get("/contact", function(request,response){
    response.render("contact.hbs")
})

    
    


app.listen(8080)