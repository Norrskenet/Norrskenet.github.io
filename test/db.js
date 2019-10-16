const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("database.db")

db.run(`
    CREATE TABLE IF NOT EXISTS blogposts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        textbody TEXT
    )
`)

db.run(`
     CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        comments TEXT,
        postId INTEGER,
        FOREIGN KEY (postId) REFERENCES blogposts(id)
     )
`)

db.run(`
        CREATE TABLE IF NOT EXISTS user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
`)

exports.getAllBlogPosts = function(callback){
    const query = "SELECT * FROM blogposts"
    db.all(query, function(error, blogpost){
        callback(error,blogpost)
    })
}

exports.getPostById = function(id, callback){
    const query = "SELECT * FROM blogposts WHERE id = ?"
    const values = [id]

    db.get(query, values, function(error, blogpost){
        callback(error, blogpost)
    })
}

exports.createBlogPost = function(title, textbody, callback){
    const query = "INSERT INTO blogposts (title, textbody) VALUES (?, ?)"
    const values = [title, textbody]

    db.run(query, values, function(error){
        const id = this.lastID
        callback(error, id)
    })
}

exports.editBlogPost = function(id, title, textbody, callback){
    const query = "UPDATE blogposts SET title=?, textbody=? WHERE id=?"
    const values = [title, textbody, id]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.deleteComments = function(id, callback){
        const query = "DELETE FROM comments WHERE postId = ?"
        const values = [id]
    
        db.run(query, values, function(error){
            callback(error, null)
        })
}
exports.deleteBlogPost = function(id, callback){
    const query = "DELETE FROM blogposts WHERE id = ?"
    const values = [id]

    db.run(query, values, function(error){
        callback(error, null)
    })
}

exports.getUser = function(username, callback){
    const query = "SELECT username FROM user WHERE username = ?"
    const values = [username]

    db.get(query, values, function(error, username){
        callback(error, username)
    })
}

exports.getHash = function(password, callback){
    const query = "SELECT password FROM user WHERE password = ?"
    const values = [password]

    db.get(query, values, function(error, password){
        callback(error, password)
    })
}

exports.login = function(usernameIn, callback){
    const query = "SELECT * FROM login WHERE (username = ?)"
    const values = [usernameIn, password]
    db.each(query, values, function(error, results, fields){
        callback(error, results, fields)
    })
}

exports.createUser = function(username, password, callback){
    const query = "INSERT INTO user (username, password) VALUES (?, ?)"
    const values = [username, password]

    db.run(query, values, function(error){
        const id = this.lastID
        callback(error, id)
    })
}

exports.search = function(title, callback){
    const query = "SELECT * FROM blogposts WHERE title = ?"
    const values = [title]

    db.all(query, values, function(error, blogpost){
        callback(error, blogpost)
    })
}

exports.createComment = function(name, message, postId, callback){
    const query = "INSERT INTO comments (name, comments, postId) VALUES (?, ?, ?)"
    const values = [name, message, postId]
	
	db.run(query, values, function(error){ 
        callback(error)
	})
}
exports.getCommentsByPostId = function(id, callback){
    const query = "SELECT * FROM comments WHERE postId = ?"
    const values = [id]

    db.all(query, values, function(error, comments){
        callback(error, comments)
    })
}