import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import ShowQueryLog from './pages/ShowQueryLog';
import EditQuerylog from './pages/EditQuerylog';
import DeleteQueryLog from './pages/DeleteQueryLog';
import CreateQueryLog from './pages/CreateQueryLog';
import EvaluateLog from './pages/EvaluateLog';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={ <Home /> } />
      <Route path='/querylog/create' element={ <CreateQueryLog />} />
      <Route path='/querylog/edit/:id' element={ <EditQuerylog />} />
      <Route path='/querylog/details/:id' element={ <ShowQueryLog />} />
      <Route path='/querylog/delete/:id' element={ <DeleteQueryLog />} />
      <Route path='/querylog/evaluate/:id' element={ <EvaluateLog />} />
      
    </Routes>
  );
};

export default App;
