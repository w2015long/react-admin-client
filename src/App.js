import React from 'react';
import { BrowserRouter, Route ,Switch } from "react-router-dom";
import Login from './pages/login/login';
import Admin from './pages/admin/admin';

function App() {
  return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Admin}/>
                <Route path="/login" component={Login}/>
            </Switch>
        </BrowserRouter>
  );
}

export default App;
