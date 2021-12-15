
import Home from './components/Home';
import RAM from './components/RAM';
import CPU from './components/CPU';

import Navigation from './components/Navigation';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App" style={{ width: 100 + "%", height: 100 + "vh" }}>

      <Navigation />
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route path='/Home' element={<Home/>} />

        <Route path='/RAM' element={<RAM/>} />

        <Route path='/CPU' element={<CPU/>} />
       </Routes>


    </div >

  );
}

export default App;
