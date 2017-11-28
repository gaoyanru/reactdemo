import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import App from './App';
import Login from './pages/login';

import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

const Routers = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/main" render={props => (
          sessionStorage.getItem('user') ? (
            <App/>
          ) : (
            <Redirect to={{
              pathname: '/login'
            }}/>
          )
        )}/>
        <Route path="/" exact  render={props => (
          sessionStorage.getItem('user') ? (
            <Redirect to={{
              pathname: '/main'
            }}/>
          ) : (
            <Redirect to={{
              pathname: '/login'
            }}/>
          )
        )}/>
        
      </Switch>
    </Router>
  </Provider>
)

Routers.propTypes = {
  store: PropTypes.object.isRequired
}

/*
<Route render={()=>(
          <Redirect to={{
            pathname: '/main'
          }}/>
        )}/>
*/
export default Routers

