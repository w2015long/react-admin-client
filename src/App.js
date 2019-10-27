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
                        ? <Redirect to="/" />
                        : <Component {...rest} />
                )}
            />

        )
      return (
            <BrowserRouter>
                <Switch>
                    <ProtectRoute exact path="/" component={Admin}/>
                    <LoginRoute path="/login" component={Login}/>
                </Switch>
            </BrowserRouter>
      );
}
}

export default App;
