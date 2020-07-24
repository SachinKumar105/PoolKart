import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/users-list.component'
import CreateUser from './components/create-user.component'
import LogInUser from './components/log-in.component'
import Vendor from './components/vendor'
import VendorAddProduct from './components/vendoraddproduct'
import VendorReadyDispatch from './components/vendorreadydispatch'
import VendorDispatched from './components/vendordispatched'
import VendorReview from './components/vendorreviews'
import Customer from './components/customer'
import CustomerSearch from './components/customersearch'
import CustomerRating from './components/customerraating'
import {
  getFromstorage,
  setInStorage,
} from './utils/storage'

function App() {
  const obj = getFromstorage('the_main_app');
  // console.log('obj',obj.role);
  if(obj && obj.role=="Vendor" && obj.token!=""){
    console.log('rooole',obj.role);
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">Bulk Ordering App</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/signin" className="nav-link">LogOut</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/vendor" className="nav-link">Vendor</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/vendoraddproduct" className="nav-link">AddProduct</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/vendorreadydispatch" className="nav-link">ReadyToDispatch</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/vendordispatched" className="nav-link">Dispatched</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/vendorreviews" className="nav-link">Reviews</Link>
                </li>
              </ul>
            </div>
          </nav>
  
          <br/>
          <Route path="/signin" component={LogInUser}/>
          <Route path="/vendor" component={Vendor}/>
          <Route path="/vendoraddproduct" component={VendorAddProduct}/>
          <Route path="/vendorreadydispatch" component={VendorReadyDispatch}/>
          <Route path="/vendordispatched" component={VendorDispatched}/>
          <Route path="/vendorreviews" component={VendorReview}/>
        </div>
      </Router>
    );
  }
  if(obj && obj.role=="Customer" && obj.token!=""){
    console.log('rooole',obj.role);
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">Bulk Ordering App</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/signin" className="nav-link">LogOut</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/customer" className="nav-link">Customer</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/customersearch" className="nav-link">Search</Link>
                </li>
              </ul>
            </div>
          </nav>
  
          <br/>
          <Route path="/signin" component={LogInUser}/>
          <Route path="/customer" component={Customer}/>
          <Route path="/customersearch" component={CustomerSearch}/>
        </div>
      </Router>
    );
  }
  else{
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">Bulk Ordering App</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/users" className="nav-link">Users</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/signup" className="nav-link">SignUp</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/signin" className="nav-link">LogIn/LogOut</Link>
                </li>
              </ul>
            </div>
          </nav>
  
          <br/>
          <Route path="/users" exact component={UsersList}/>
          <Route path="/signup" component={CreateUser}/>
          <Route path="/signin" component={LogInUser}/>
          <Route path="/vendor" component={Vendor}/>
          <Route path="/vendoraddproduct" component={VendorAddProduct}/>
          <Route path="/vendorreadydispatch" component={VendorReadyDispatch}/>
          <Route path="/vendordispatched" component={VendorDispatched}/>
          <Route path="/vendorreviews" component={VendorReview}/>
          <Route path="/customer" component={Customer}/>
          <Route path="/customersearch" component={CustomerSearch}/>
          <Route path="/customerrating" component={CustomerRating}/>
        </div>
      </Router>
    );
  }
  
}

export default App;
