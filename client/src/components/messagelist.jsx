import React from 'react';
import ReactMarkdown from 'react-markdown';

function MessageList({ messages, isLoading }) { // Recibimos messages y isLoading como props
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          {msg.sender === 'bot' ? (
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          ) : (
            <p>{msg.text}</p>
          )}
        </div>
      ))}
      {/* Mostramos un indicador de carga si isLoading es true */}
      {isLoading && (
        <div className="message bot loading">
          <p>🤔 Procesando tu solicitud... 🔍</p>
        </div>
      )}
    </div>
  );
}

export default MessageList;