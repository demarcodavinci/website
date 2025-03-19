const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve HTML files
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Signup route
app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Save user data to txt file
    const userData = `${username},${password}\n`;
    fs.appendFile('users.txt', userData, (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send('User  registered successfully!');
    });
});

// Login route
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Read user data
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file', err);
            return res.status(500).send('Internal Server Error');
        }

        const users = data.split('\n').filter(Boolean);
        const userFound = users.find(user => {
            const [fileUsername, filePassword] = user.split(',');
            return fileUsername === username && filePassword === password;
        });

        if (userFound) {
            res.send('Login Successful!');
        } else {
            res.send('Invalid username or password.');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});