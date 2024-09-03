import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// Components
import Nav from './components/Nav';

// Context
import { UserProvider } from './context/UserContext';

// Screens
import Date from './screens/Date';
import Drawing from './screens/Drawing';
import Exercices from './screens/Exercices';
import FallingWords from './screens/FallingWords';
import Flashcard from './screens/Flashcard';
import Grammar from './screens/Grammar';
import Home from './screens/Home';
import HiddenWords from './screens/HiddenWords';
import JLPT from './screens/JLPT';
import Kanji from './screens/Kanji';
import List from './screens/List';
import Login from './screens/Login';
import MeliMelo from './screens/Melimelo';
import Numbers from './screens/Numbers';
import Quiz from './screens/Quiz';
import Search from './screens/Search';
import Time from './screens/Time';

// Styles
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercices" element={<Exercices />} />
          <Route path="/exercices/date" element={<Date />} />
          <Route path="/exercices/drawing" element={<Drawing />} />
          <Route path="/exercices/fallingwords" element={<FallingWords />} />
          <Route path="/exercices/flashcard" element={<Flashcard />} />
          <Route path="/exercices/grammar" element={<Grammar />} />
          <Route path="/exercices/hiddenwords" element={<HiddenWords />} />
          <Route path="/exercices/melimelo" element={<MeliMelo />} />
          <Route path="/exercices/numbers" element={<Numbers />} />
          <Route path="/exercices/quiz" element={<Quiz />} />
          <Route path="/exercices/time" element={<Time />} />
          <Route path="/kanji" element={<Kanji />} />
          <Route path="/list" element={<List />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/jlpt/dashboard" element={<JLPT />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
