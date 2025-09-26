import React, { useState } from 'react'; 
import MessageList from './messagelist';
import InputBar from './inputbar';
import axios from 'axios';

function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🤖 ¡Hola! Soy CrawlAI, un chatbot con capacidad de acceder al contenido de paginas web! Si quieres, pega una URL 🌐 y hazme una pregunta sobre su contenido, o hablemos normalmente! ¡Estoy listo para explorar! 🚀' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userMessage, url) => {
    const newUserMessage = { sender: 'user', text: userMessage };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/chat', { userMessage: userMessage, url: url });
      const aiMessage = { sender: 'bot', text: response.data.aiResponse };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error al comunicarse con el servidor:', error);
      const errorMessage = { sender: 'bot', text: '😔 Lo siento, hubo un error al procesar tu solicitud. Inténtalo de nuevo. 🔄' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <MessageList messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;