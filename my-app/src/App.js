import logo from './aws_logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input className= "upload" type='file' accept='image/*'/>
        <p>
          Upload your plant picture here.
        </p>
        
      </header>
    </div>
  );
}

export default App;
