const express = require('express')
const db = require('./db')
const bcrypt = require('bcryptjs')

const router = express.Router()

username = "a"
password = bcrypt.hashSync('Red',10)

router.get("/", function (request, response) {
    response.render("login.hbs")
})


router.post("/log", function (request, response) {

  
    if (username == request.body.username && bcrypt.compareSync(request.body.password, password) == true) {
        request.session.isLoggedIn = true
        response.redirect("/")
    }
    else {
        response.render("login.hbs")
    }

})


router.get('/logout', function(request,response,next){
    request.session.isLoggedIn=false
    request.session.destroy()
    response.clearCookie()
    response.redirect("/")
    next()
})

router.get("/sign-up", function(request,response){
    response.render("sign-up.hbs")
})

router.post("/sign-up", function(request,response){
        const username = request.body.username
        var hash = bcrypt.hashSync(request.body.password, 10)
        const password = hash

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
                    response.redirect("login.hbs")
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

    module.exports = router