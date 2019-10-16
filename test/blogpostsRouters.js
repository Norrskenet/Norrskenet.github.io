
const express = require('express')
const db = require('./db')
const paginate = require('express-paginate')
paginate.middleware(10, 20)
const router = express.Router()



router.get("/", function(request, response){
    db.getAllBlogPosts(function(error, blogpost){
        if(error){
            const model = {
                somethingWrong: true
            }
            response.render("posts.hbs", model)
        }
        else{
            const model = {
                somethingWrong: false,
                blogpost
            }
            response.render("posts.hbs", model)
        }
    })
})

router.post("/edit", function(request, response){
    const id = request.body.id
    db.getPostById(id, function(error,blogpost){
        if (error){
            const model = {
                somethingWrong: true
            }
            response.render("edit.hbs", model)
        }
        else{
            const model = {
                somethingWrong: false,
                blogpost
            }

            response.render("edit.hbs", model)
        }
    })
})

router.post("/edit/:id", function(request, response){
    const id = request.body.id
    const title = request.body.title
    const textbody = request.body.textbody
    db.editBlogPost(id, title, textbody, function(error){
        if(error){
            const model = {
                somethingWrong: true
            }
            response.render("posts.hbs", model)
        }
        else{
    
            response.redirect("/posts/post/" + id)
        }
    })
})

router.post("/", function(request, response){
    const title = request.body.title

    db.search(title, function(error, blogpost){
        if(error){
        
        }
        else{
            const model={
                somethingWrong:false,
                blogpost
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

router.get("/post/:id", function(request,response){
    const id = request.params.id
    
    db.getPostById(id, function(error,blogpost){
        if (error){
            const model = {
                somethingWrong: true
            }
            response.render("post.hbs",model)
        }
        else
        {  
            db.getCommentsByPostId(id, function(error,comments){
                if(error){   
                    const model = {
                    somethingWrong: true
                    }
                    response.render("post.hbs",model)
                }
                else{
                    
                    const model = {
                        somethingWrong: false,
                        blogpost,
                        comments
                    }
                    response.render("post.hbs", model)
    
                }
            })
        }
    })
})

router.post("/create", function(request,response){
    const title = request.body.title
    const textbody = request.body.textbody

    const validationErrors = []

    if(title == ""){
        validationErrors.push("Must enter a title.")
    }
    if(textbody == ""){
        validationErrors.push("Must enter a text.")
    }

    if(validationErrors.length == 0){
        db.createBlogPost(title, textbody, function(error, id){
            if(error){
                const model ={
                    error
                }
                response.render("posts.hbs", model)

            }
            else{
                response.redirect("/posts/post/" + id)
            } 
        })
    }
    else{
        const model = {
            validationErrors,
            title,
            textbody
        }
        response.render("create-post.hbs", model)
    }
})

router.post("/delete", function(request,response){
    const id = request.body.id
    db.deleteBlogPost(id, function(error){
        if(error){
            const model = {
                somethingWrong: true
            }
            response.render("post.hbs" + id ,model)
        }
        else{
            db.deleteComments(id,function(error){
                if (error){

                }
                else{
                    response.redirect("/posts/")
                } 
            })
        }
    })
})

router.post("/comments", function(request, response){
	
	const name = request.body.name
	const message = request.body.message
	const postId = request.body.id
    
    db.createComment(name, message, postId, function(error){
        if(error){

        }
        else{
            response.redirect("/posts/post/" + postId)
        }
    })

	
})

module.exports = router