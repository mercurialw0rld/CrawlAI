import './App.css';
import ChatWindow from './components/chatwindow.jsx'; 

function App() {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px', verticalAlign: 'middle' }}>
            <path d="M12 2C13.1 2 14 2.9 14 4V5H16C17.1 5 18 5.9 18 7V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V7C6 5.9 6.9 5 8 5H10V4C10 2.9 10.9 2 12 2ZM12 4V5H12V4ZM8 7V19H16V7H8ZM10 9H14V11H10V9ZM10 13H14V15H10V13Z" fill="white"/>
          </svg>
          <span style={{ fontStyle: 'italic' }}>CrawlAI</span>
        </h1>
      </header>
      <div className="app-container">
        <ChatWindow />
        <footer className="app-footer">
          <p>
            Creado con ❤️ por{' '}
            <a href="https://github.com/mercurialw0rld" target="_blank" rel="noopener noreferrer">
              @mercurialw0rld
            </a>
            {' '}🐙
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
