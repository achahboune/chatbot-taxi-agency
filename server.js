require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable All CORS Requests
app.use(bodyParser.json());

// A simple AI function to answer questions based on website content
async function getAIResponse(question) {
    // In a real-world scenario, you would use a proper NLP/NLU engine.
    // For this example, we'll use a simple keyword-based approach.
    const lowerCaseQuestion = question.toLowerCase();

    if (lowerCaseQuestion.includes('réserver') || lowerCaseQuestion.includes('reservation')) {
        return "Vous pouvez réserver un taxi médical directement sur notre site web en utilisant le formulaire de réservation. Remplissez simplement vos informations et nous confirmerons votre trajet.";
    } else if (lowerCaseQuestion.includes('service')) {
        return "Nous offrons plusieurs services de transport médical, y compris pour les visites en laboratoire clinique, les rendez-vous en laboratoire de génomique et les services généraux de soins à domicile. Nous assurons également le transport pour les tests COVID-19 et autres panels d'examens.";
    } else if (lowerCaseQuestion.includes('prix') || lowerCaseQuestion.includes('coût')) {
        return "Pour les informations sur les tarifs, veuillez consulter la section 'Tarifs & Forfaits' sur notre site web pour des plans détaillés.";
    } else if (lowerCaseQuestion.includes('contact')) {
        return "Vous pouvez trouver nos coordonnées dans la section 'À propos de nous' du site web.";
    } else {
        return "Je peux répondre aux questions sur la réservation, les services et les tarifs. Pourriez-vous poser une question relative à nos services de taxi médical ?";
    }
}


app.post('/ask', async (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: 'La question est requise' });
    }
    const answer = await getAIResponse(question);
    res.json({ answer });
});

// Endpoint to save chat history to Google Sheets
app.post('/save-response', async (req, res) => {
    const { question, answer } = req.body;

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:C',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[new Date().toISOString(), question, answer]],
            },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        res.status(500).json({ error: 'Échec de l\'enregistrement de l\'historique des discussions.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
