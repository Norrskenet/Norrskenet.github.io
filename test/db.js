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

db.run(`
        CREATE TABLE IF NOT EXISTS user(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
`)

exports.getAllBlogPosts = function(callback){
    const query = "SELECT * FROM blogposts"
    
    db.all(query, function(error, blogposts){
        callback(error,blogposts)
    })
}

exports.getPostById = function(id, callback){
    const query = "SELECT * FROM blogposts WHERE id = ?"
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

exports.deleteBlogPost = function(id, callback){
    const query = "DELETE FROM blogposts WHERE id = ?"
    const values = [id]

    db.run(query, values, function(error){
        callback(error, id)
    })
}

exports.login = function(username, password, callback){
    const query = "SELECT * FROM login WHERE (username = ? AND password = ?)"
    const values = [username, password]
    db.get(query, values, function(error,login){
        callback(error,login)
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