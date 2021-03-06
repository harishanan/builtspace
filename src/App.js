import React, { useState, useEffect } from "react";
import './styles/App.css';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";



// Components
import Form from './components/Form';
import Orders from './components/Orders';
import Customers from './components/Customers';
import NavBar from './components/Navbar';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Create_order from "./components/CreateOrder";
import Profile from "./components/Profile";
import Login from "./components/Login"
import { onError } from "./libs/errorLib";
import Signup from "./components/Signup";
// import Test from "./components/DelCustomer";

import EditCustomer from "./components/EditCustomer"


Amplify.configure(awsconfig);

function App() {
  const URL = awsconfig.aws_cloud_logic_custom.endpoint;
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
 
  // Call the onLoad function only once on page load
  useEffect(() => {
    onLoad();
  }, []);
  
  // Check if user is signed in
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <NavBar />
          <Switch>
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/login' component={Login} />
            <Route path='/' component={Login} />
          </Switch>
          </AppContext.Provider>
    </Router>
    )
  }

  return (
    isAuthenticated && (
    <Router>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <NavBar />
          <Switch>
            <Route exact path='/' component={Customers} />
            <Route exact path='/customers' component={Customers} />
            <Route path='/orders' component={Orders} />
            <Route path='/new_customer' component={Form} />
            <Route path='/customer/edit' component={EditCustomer} />
            {/* <Route path='/create_order' component={Create_order} /> */}
            {/* <Route path='/creating_order' component={CreateOrder} /> */}
            {/* <Route path='/test' component={CreateOrder} /> */}
            <Route path='/profile' component={Profile} />
            <Route path='/login' component={Login} />
            <Route exact path="/signup">
              <Signup />
            </Route>
          </Switch>
          </AppContext.Provider>
    </Router>
    )
  );
}

export default App;