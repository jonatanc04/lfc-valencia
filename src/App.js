import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Header } from './components/Header';
import { Principal } from './pages/Principal';

function App() {
  return (
    <div className="App">
      <Header />
      <Principal />
    </div>
  );
}

export default App;
