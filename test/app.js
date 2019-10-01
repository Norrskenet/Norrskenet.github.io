const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()

app.use(express.static("public"))

app.use(bodyParser.urlencoded({
    extended: false
}))

app.engine("hbs", expressHandlebars({
	defaultLayout: "main.hbs"
}))

app.get("/", function(request,response){
    response.render("home.hbs")
})

app.get("/about", function(request,response){
    response.render("about.hbs")
})

app.listen(8080)