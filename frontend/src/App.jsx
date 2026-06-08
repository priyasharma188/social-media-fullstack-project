import { BrowserRouter , Routes , Route } from 'react-router-dom';
 import Login from './pages/Login';
 import Signup from './pages/Signup';
 import Feed from './pages/Feed';

function  App() {
  return (
  <BrowserRouter>
       <Routes>
           <Route path='/' element={<Login />} />
           <Route path='/signup' element={<Signup />}/>
           <Route path='/feed' element={<Feed />}/>
       </Routes>
  </BrowserRouter>
  );
}

export default App;