const sqlite3 = require('sqlite3')

const db = new sqlite3.Database("database.db")

db.run(`
    CREATE TABLE IF NOT EXISTS blogposts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        date TEXT
    )
`)

/*db.run(`
     CREATE TABLE IF NOT EXISTS coments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        comments TEXT,
        postId INTEGER,
        FOREIGN KEY postId REFERENCES blogposts(id)
     )
`)*/

exports.getAllBlogPosts = function(callback){
    const query = "SELECT * FROM blogposts"
    
    db.all(query, function(error, blogposts){
        callback(error,blogposts)
    })
}

exports.getPostById = function(id, callback){
    const query = "SELECT * FROM blogposts WHERE id= ?"
    const values = [id]

    db.get(query, values, function(error, blogpost){
        callback(error, blogpost)
    })
}

exports.createBlogPost = function(title, date, callback){
    const query = "INSERT INTO blogposts (title, date) VALUES (?, ?)"
    const values = [title, date]

    db.run(query, values, function(error){
        const id = this.lastID
        callback(error, id)
    })
}