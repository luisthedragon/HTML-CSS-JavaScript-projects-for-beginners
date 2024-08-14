const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Define the path to the projects directory
const projectsDir = path.join(__dirname, 'projects');

// Serve the list of project directories as a JSON array
app.get('/projects', (req, res) => {
    fs.readdir(projectsDir, (err, files) => {
        if (err) {
            res.status(500).send('Unable to scan projects directory.');
            return;
        }
        const projects = files.filter(file => fs.statSync(path.join(projectsDir, file)).isDirectory());
        res.json(projects);
    });
});

// Loop through each project folder and create a route for it
fs.readdirSync(projectsDir).forEach(folder => {
    const projectPath = path.join(projectsDir, folder);
    if (fs.statSync(projectPath).isDirectory()) {
        app.use(`/${folder}`, express.static(projectPath));
    }
});

// Serve the landing page at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

