import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {Navbar} from './components/Navbar';
import { Home } from './components/Home';
import About  from './components/About'; // Example: Additional component
import NoteState from './context/notes/NoteState';

function App() {
  return (
    <div className="App">
    
      <NoteState>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
      </NoteState>
    </div>
  );
}

export default App;
