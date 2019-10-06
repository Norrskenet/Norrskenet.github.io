const express = require('express')
const db = require('./db')

const router = express.Router()

router.get("/", function(request, response){
    db.getAllBlogPosts(function(error, blogposts){

        if(error){
            const model = {
                somethingWrong: true
            }
            response.render("posts.hbs", model)
        }
        else{
            const model = {
                somethingWrong: false,
                blogposts
            }
            response.render("posts.hbs", model)
        }
    })
})

router.get("/create", function(request,response){
    const model = {
        validationErrors: []
    }
    response.render("create-post.hbs", model)
})

router.get("/:id", function(request,response){
    const id = request.params.id
    
    db.getPostById(id, function(request,response){
        if (error){

        }
        else{
            const model = {
                blogposts
            }

            response.render("post.hbs", model)
        }
    })
})

router.post("/create", function(request,response){
    const title = request.body.title
    const date = request.body.date

    const validationErrors = []

    if(title == ""){
        validationErrors.push("Must enter a title.")
    }
    if(date == ""){
        validationErrors.push("Must enter a date.")
    }

    if(validationErrors.length == 0){
        db.createBlogPost(title, date, function(error, id){
            if(error){

            }
            else{
                response.redirect("/blogposts/" + id)
            } 
        })
    }
    else{
        const model = {
            validationErrors,
            title,
            date
        }
        response.render("create-post.hbs", model)
    }
})

module.exports = router