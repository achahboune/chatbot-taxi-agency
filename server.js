const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint - to check if the server is online
app.get('/', (req, res) => {
    res.status(200).send('Le cerveau du chatbot est en ligne et fonctionne !');
});

// Simple echo endpoint for testing
app.post('/ask', async (req, res) => {
    const { question } = req.body;
    console.log(`Received question: ${question}`);
    
    if (!question) {
        return res.status(400).json({ error: 'La question est requise' });
    }
    
    // Echo the question back for this test
    const answer = `Vous avez demandé : "${question}". La connexion fonctionne !`;
    
    res.json({ answer });
});

// The /save-response endpoint is removed for this test.
// We also remove all 'require("dotenv")' and 'googleapis' code.

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});