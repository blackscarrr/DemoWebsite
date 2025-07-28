document.addEventListener('DOMContentLoaded', function() {
            const chatForm = document.getElementById('chat-form');
            const userInput = document.getElementById('user-input');
            const chatContainer = document.getElementById('chat-container');
            
            chatForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const message = userInput.value.trim();
                if (!message) return;

                addMessageToChat(message, 'user');
                userInput.value = '';

                const typingIndicator = document.createElement('div');
                typingIndicator.className = 'mb-4 flex';
                typingIndicator.innerHTML = `
                    <div class="bg-blue-100 rounded-r-xl rounded-bl-xl px-4 py-3 max-w-xs">
                        <span class="typing-indicator"></span>
                    </div>
                `;
                chatContainer.appendChild(typingIndicator);
                chatContainer.scrollTop = chatContainer.scrollHeight;

                try {
                    const res = await fetch('http://localhost:3001/UI', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });
                    const data = await res.json();
                    chatContainer.removeChild(typingIndicator);
                    addMessageToChat(data.response, 'ai');
                } catch (err) {
                    chatContainer.removeChild(typingIndicator);
                    addMessageToChat('Sorry, something went wrong.', 'ai');
                }
            });

            function addMessageToChat(message, sender) {
                const chatContainer = document.getElementById('chat-container');
                const messageDiv = document.createElement('div');
                messageDiv.className = `message-animation mb-4 flex ${sender === 'user' ? 'justify-end' : ''}`;
                messageDiv.innerHTML = `
                    <div class="${sender === 'user' ? 'bg-blue-600 text-white rounded-l-xl rounded-br-xl' : 'bg-blue-100 rounded-r-xl rounded-bl-xl'} px-4 py-3 max-w-xs">
                        <p>${message}</p>
                    </div>
                `;
                chatContainer.appendChild(messageDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        });
