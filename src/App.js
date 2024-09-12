import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// Components
import Nav from './components/Nav';

// Context
import { UserProvider } from './context/UserContext';

// Screens
import Date from './screens/exercices/Date';
import Drawing from './screens/exercices/Drawing';
import Exercices from './screens/Exercices';
import FallingWords from './screens/exercices/FallingWords';
import Flashcard from './screens/exercices/Flashcard';
import Grammar from './screens/exercices/Grammar';
import Home from './screens/Home';
import HiddenWords from './screens/exercices/HiddenWords';
import JLPT from './screens/JLPT';
import Kanji from './screens/Kanji';
import List from './screens/List';
import Listening from './screens/exercices/Listening';
import Login from './screens/Login';
import MeliMelo from './screens/exercices/Melimelo';
import Numbers from './screens/exercices/Numbers';
import Pronunciation from './screens/exercices/Pronunciation';
import Quiz from './screens/exercices/Quiz';
import Register from './screens/Register';
import Search from './screens/Search';
import Shop from './screens/Shop';
import Time from './screens/exercices/Time';

// Styles
import './App.css';

// Secure Routes
import { PrivateRoute } from './secure/useSecureRoute';

function App() {
  return (
    <UserProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register/:role/:id?" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/exercices/pronunciation" element={<Pronunciation />} />
          <Route element={<PrivateRoute />}>
            <Route path="/exercices" element={<Exercices />} />
            <Route path="/exercices/date" element={<Date />} />
            <Route path="/exercices/drawing" element={<Drawing />} />
            <Route path="/exercices/fallingwords" element={<FallingWords />} />
            <Route path="/exercices/flashcard" element={<Flashcard />} />
            <Route path="/exercices/grammar" element={<Grammar />} />
            <Route path="/exercices/hiddenwords" element={<HiddenWords />} />
            <Route path="/exercices/listening" element={<Listening />} />
            <Route path="/exercices/melimelo" element={<MeliMelo />} />
            <Route path="/exercices/numbers" element={<Numbers />} />
            <Route path="/exercices/quiz" element={<Quiz />} />
            <Route path="/exercices/time" element={<Time />} />
            <Route path="/jlpt/dashboard" element={<JLPT />} />
            <Route path="/kanji" element={<Kanji />} />
            <Route path="/list" element={<List />} />
            <Route path="/search" element={<Search />} />
            <Route path="/shop" element={<Shop />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
