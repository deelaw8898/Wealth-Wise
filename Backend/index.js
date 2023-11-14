const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'asdf1234'
});

function createDatabase() {
  db.query("CREATE DATABASE IF NOT EXISTS Tracker", (err, result) => {
    if (err) {
      console.error("Error creating database: ", err);
      return;
    }
    console.log("Database 'Tracker' created or verified successfully");
    useDatabase();
  });
}

function useDatabase() {
  db.query("USE Tracker", (err, result) => {
    if (err) {
      console.error("Error using database: ", err);
      return;
    }
    console.log("Using database 'Tracker'");
    createUserTable();
  });
}


db.connect(error => {
  if (error) {
    console.error("Error connecting to MySQL: ", error);
    return;
  }
  console.log("Successfully connected to MySQL.");
  createDatabase();
});


// need to add the first and last name and email
function createUserTable() {
    db.query(
      "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, username VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, email VARCHAR(255), is_admin BOOLEAN NOT NULL, PRIMARY KEY (id)) ENGINE=InnoDB;",
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Users table created/checked");
        }
      }
    );
}

createUserTable();


app.post('/register', (req, res) => {
  const { username, password, first_name, last_name, email } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error registering user');
      } else if (results.length > 0) {
          res.status(409).send('Username already taken');
      } else {
          db.query("INSERT INTO users (username, password, first_name, last_name, email, is_admin) VALUES (?, ?, ?, ?, ?, 0)", [username, password, first_name, last_name, email], (err, results) => {
              if (err) {
                  console.log(err);
                  res.status(500).send('Error registering user');
              } else {
                  res.status(201).send('User registered successfully');
              }
          });
      }
  });
});




app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(`Trying to log in with username: ${username}, password: ${password}`); // Add this line
    
    db.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password], 
        (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error logging in');
            } else if (results.length === 0) { // no user found with the given credentials
                console.log('Invalid username or password'); // Add this line
                res.status(401).send('Invalid username or password');
            } else { // user found, login successful
                console.log('Login successful'); // Add this line
                res.status(200).send('Login successful');
            }
        }
    );
});


app.listen(PORT, () => {
    console.log('server is running on port ' + PORT + ".");
});