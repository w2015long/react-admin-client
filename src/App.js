import React, {Component} from 'react';
import { BrowserRouter, Route ,Switch,Redirect } from "react-router-dom";
import {getUser} from "./utils/userStore";

import Login from './pages/login/login';
import Admin from './pages/admin/admin';

class App extends Component{
    render() {
        const ProtectRoute = ({component:Component,...rest})=>(
            <Route
                {...rest}
                render={(props)=>(
                    getUser()
                        ? <Component {...props} />
                        : <Redirect to="/login" />
                )}
            />
        )

        const LoginRoute = ({component:Component,...rest})=>(
            <Route
                render={()=>(
                    getUser()
                        ? <Redirect to="/home" />
                        : <Component {...rest} />
                )}
            />

        )
      return (
            <BrowserRouter>
                <Switch>
                    <LoginRoute path="/login" component={Login}/>
                    <ProtectRoute path="/" component={Admin}/>
                </Switch>
            </BrowserRouter>
      );
}
}

export default App;
