import logo from './logo.svg';
import './App.css';
import ChatScreen from './Chat-screen/Chat.js';
import MyNavbar from './Navbar/Navbar.js';

function App() {
  return (
    <div className="App">
      <MyNavbar/>
      <ChatScreen/>
    </div>
  );
}

export default App;
