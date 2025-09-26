import React, { useState } from 'react'; 
import MessageList from './messagelist';
import InputBar from './inputbar';
import axios from 'axios';

function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🤖 ¡Hola! Soy CrawlAI, un chatbot con capacidad de acceder al contenido de paginas web! Si quieres, pega una URL 🌐 y hazme una pregunta sobre su contenido, o hablemos normalmente! ¡Estoy listo para explorar! 🚀' }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  let conversationHistory = { user: [], bot: [] };

  const handleSendMessage = async (userMessage, url, pdfFile) => {
    const newUserMessage = { sender: 'user', text: userMessage };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    conversationHistory.user.push(userMessage);

    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // Crear FormData para enviar el archivo PDF
      const formData = new FormData();
      formData.append('userMessage', userMessage);
      formData.append('url', url || '');
      formData.append('history', JSON.stringify(conversationHistory));
      if (pdfFile) {
        formData.append('pdfFile', pdfFile);
      }
      
      const response = await axios.post(`${apiUrl}/api/chat`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const aiMessage = { sender: 'bot', text: response.data.aiResponse };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      conversationHistory.bot.push(response.data.aiResponse);
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