import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar/navbar';
import RothCalc from './components/rothCalc/rothCalc';
import DivCalc from './components/divCalc/divCalc';
import { ThemeProvider } from './theme';
function App() {
  return (
    <>
    <ThemeProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<RothCalc />} />
          <Route path="/divCalc" element={<DivCalc />} />
        </Routes>
      </Router>
      </ThemeProvider>
    </>
    
  );
}

export default App;
