import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { keepLogin, cookieChecked } from './actions';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Header from './components/Header';
import ConcessionListView from './components/ConcessionListView';
import ConcessionGridView from './components/ConcessionGridView';
import ConcessionDetails from './components/ConcessionDetails';
import Cart from './components/Cart';
import PropTypes from "prop-types";
import CheckOut from './components/CheckOut';
import _History from './components/History';
import HistoryDetails from './components/HistoryDetails';

const cookies = new Cookies();

class App extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    const newCookie = cookies.get('usernameCookie');
    if(newCookie) {
        this.props.keepLogin(newCookie);
    } else {
        this.props.cookieChecked();
    }
  }

  render() {

    const { location } = this.props;

    if(this.props.cookie) {

      //================= START > BREADCRUMB =================//
      var currentPage;
      if(location.pathname === '/') currentPage = '';
      else if(location.pathname === '/concessionlistview') currentPage = 'Concession List View';
      else if(location.pathname === '/concessiongridview') currentPage = 'Concession Grid View';
      else if(location.pathname === '/concessiondetails') currentPage = 'Concession Details';
      else if(location.pathname === '/cart') currentPage = 'Cart';
      else if(location.pathname === '/checkout') currentPage = 'Checkout';
      else if(location.pathname === '/history') currentPage = 'History';
      else if(location.pathname === '/historydetails') currentPage = 'History Details';
      else currentPage = location.pathname;
      
      var breadCrumb;
      if(location.pathname !== '/login' && location.pathname !== '/register' ) {
        breadCrumb = 
        <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">{currentPage}</li>
              </ol>
            </nav>
          </div>;
      } 
      //================= END > BREADCRUMB =================//

      return (
        <div className={"container"}>

        <Header NavBrand={'Template Project React JS'} />

        {breadCrumb}
        
        <Route exact path="/" component={HomePage}/>
        <Route path="/login" component={LoginPage}/>
        <Route path="/register" component={RegisterPage}/>
        <Route path="/concessionlistview" component={ConcessionListView}/>
        <Route path="/concessiongridview" component={ConcessionGridView}/>
        <Route path="/concessiondetails" component={ConcessionDetails}/>
        <Route path="/cart" component={Cart}/>
        <Route path="/history" component={_History}/>
        <Route path="/historydetails" component={HistoryDetails}/>
        <Route path="/checkout" component={CheckOut}/>
          
      </div>
      )
    }

    return (
      <div>
        <br/><br/>
        <center><h5>Loading...</h5></center>
      </div> 
    )
  }
}

const mapStateToProps = (state) => {
  return { 
           cookie: state.auth.cookie,
           path: state.auth.path 
          }
}
export default withRouter(connect(mapStateToProps, { keepLogin, cookieChecked })(App));
