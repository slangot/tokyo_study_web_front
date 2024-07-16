import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// Components
import Nav from './components/Nav';

// Screens
import Drawing from './screens/Drawing';
import Exercices from './screens/Exercices';
import Flashcard from './screens/Flashcard';
import Home from './screens/Home';
import HiddenWords from './screens/HiddenWords';
import Kanji from './screens/Kanji';
import List from './screens/List';
import MeliMelo from './screens/Melimelo';
import Quiz from './screens/Quiz';
import Search from './screens/Search';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercices" element={<Exercices />} />
        <Route path="/exercices/drawing" element={<Drawing />} />
        <Route path="/exercices/flashcard" element={<Flashcard />} />
        <Route path="/exercices/hiddenwords" element={<HiddenWords />} />
        <Route path="/exercices/melimelo" element={<MeliMelo />} />
        <Route path="/exercices/quiz" element={<Quiz />} />
        <Route path="/kanji" element={<Kanji />} />
        <Route path="/list" element={<List />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
