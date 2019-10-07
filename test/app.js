  
const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const blogpostsRouter = require('./blogpostsRouters')
const expressSession = require('express-session')
const SQLiteStore = require('connect-sqlite3')(expressSession)
const cookieparser = require('cookie-parser')

const db = require('./db')

const app = express()

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(expressSession({
    secret: "iojasdijasijdfiajsid",
    saveUninitialized: false,
    resave: false,
    store: new SQLiteStore()
}))

app.use(function(request, response, next){
    response.locals.isLoggedIn = request.session.isLoggedIn
    next()
})

app.use("/posts", blogpostsRouter)

app.engine("hbs", expressHandlebars({
	defaultLayout: "main.hbs"
}))

app.get("/", function(request,response){
    response.render("home.hbs")
})

app.get("/about", function(request,response){
    response.render("about.hbs")
})

app.get("/login", function(request,response){
    response.render("login.hbs")
})

app.post("/login", function(request,response){
    const username = request.body.username
    const password = request.body.password
    db.login(username, password, function(){
        if(request.body.username == username && request.body.password == password){
            request.session.isLoggedIn = true
            response.redirect("/")
        }
        else{
            response.render("login.hbs")
        }
    })
})

app.get('/logout', function(request,response,next){
    request.session.isLoggedIn=false
    request.session.destroy()
    response.clearCookie()
    response.redirect("/")
    next()
})

app.get("/sign-up", function(request,response){
    response.render("sign-up.hbs")
})

app.post("/sign-up", function(request,response){
        const username = request.body.username
        const password = request.body.password
    
        const validationErrors = []
    
        if(username == ""){
            validationErrors.push("Must enter a Usernamer")
        }
        if(password == ""){
            validationErrors.push("Must enter a Password")
        }
    
        if(validationErrors.length == 0){
            db.createUser(username, password, function(error){
                if(error){
                    
                }
                else{
                    response.redirect("/")
                } 
            })
        }
        else{
            const model = {
                validationErrors,
                username,
                password
            }
            response.render("home.hbs", model)
        }
    })
    


app.listen(8080)