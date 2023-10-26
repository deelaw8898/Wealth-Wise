const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./router/db/server.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, income FLOAT)');
    db.close();
});

router.get('/', (req,res) => {
    res.end("NA")
});

router.get('/api/data', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  router.post('/api/register', (req, res) => {
    const db = new sqlite3.Database('./router/db/server.db');
    const { username, password, income} = req.body;
    console.log(username + " " + password + " " + income);
    
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    db.get(checkQuery, [username], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        } 
        else if (row) {
            console.log('Username is not unique');
            res.status(409).json({ error: 'Username is not unique' });
        } 
        else {
            const query = 'INSERT INTO users (username, password, income) VALUES (?, ?, ?)';
            db.serialize(() => {
                console.log("INCOME: " + income);
                db.run(query, [username, password, income], (err) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        db.close();
                        return;
                    }

                    res.status(201).json({ message: 'User registered successfully' });
                });
                db.close();
            });
        }
    });
});

// INCOMPLETE PORTION HERE
router.post('/api/login', (req, res) => {
    const db = new sqlite3.Database('./router/db/server.db');
    const { username, password } = req.body;

    const query = 'SELECT id, username FROM users WHERE username = ? AND password = ?';
    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            db.close();
            return;
        }

        if (!row) {
            res.status(401).json({ error: 'Incorrect username or password' });
            db.close();
            return;
        }

        res.json({ message: 'User logged in successfully' });
        db.close();
    });
});

module.exports = router;