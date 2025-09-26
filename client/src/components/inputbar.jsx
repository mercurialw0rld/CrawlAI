import React, { useState } from 'react';

  function InputBar({ onSendMessage }) { 
    const [userMessage, setUserMessage] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault(); 
      if (!userMessage.trim()) return; 

      onSendMessage(userMessage, url, e.target.pdfFile.files[0]); 

      setUserMessage(''); 
     
  };

  return (
    <form className="input-bar" onSubmit={handleSubmit}>
      <input 
        type="file" 
        name="pdfFile" 
        accept="application/pdf" />   
      <input
        type="text"
        placeholder="URL del artículo..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Escribe tu pregunta..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default InputBar;