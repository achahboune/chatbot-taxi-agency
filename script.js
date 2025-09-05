document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    // ✅ URL de ton backend Render
    const API_URL = "https://chatbot-taxi-agency.onrender.com";

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const question = chatInput.value.trim();
        if (!question) return;

        appendMessage(question, 'user');
        chatInput.value = '';

        try {
            // Get AI response depuis ton backend
            const response = await fetch(`${API_URL}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const answer = data.answer;

            appendMessage(answer, 'bot');



        } catch (error) {
            console.error('Error:', error);
            appendMessage('Désolé, une erreur est survenue. Veuillez réessayer plus tard.', 'bot');
        }
    }

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        const p = document.createElement('p');
        p.textContent = message;
        messageElement.appendChild(p);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
