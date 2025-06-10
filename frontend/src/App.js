import ALX from './ALX.jpg';
import './App.css';
import { getFullYear, getFooterCopy } from './utils'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={ALX} className="App-logo" alt="logo" />
        <h1>School dashboard</h1>
      </header>
      <hr className="header-divider" />
      <div className="App-body">
        <p>Login to access the full dashboard</p>
        <label Htmlfor="email">Email:</label>
        <input type="email" id="email"></input>
        <label Htmlfor="password">Password</label>
        <input type="password" id="password"></input>
        <button>OK</button>
      </div>
      <hr className="footer-divider" />
      <footer className="App-footer">
        <p>Copyright {getFullYear()} - {getFooterCopy(true)}</p>
      </footer>
    </div>
  );
}

export default App;
