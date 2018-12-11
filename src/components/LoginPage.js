import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onUserLogin } from '../actions';
import { Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class LoginPage extends Component {

    onBtnSubmit = () => {
      var username = this.refs.username.value;
      var password = this.refs.password.value;
      this.props.onUserLogin({username, password}); //===========> PANGGIL ACTION CREATOR
    }

    componentWillReceiveProps(newProps) {
      if(newProps.username !== '') {
        cookies.set('usernameCookie', newProps.username, { path: '/' });
        cookies.set('roleCookie', newProps.role, { path: '/' });
      }
    }

    render() {

      if(this.props.username === "") {

        var alertLogin = this.props.errorLogin;
        if(alertLogin) {
          var alertLog = <p align='left' style={{ fontSize: '13px' }} 
                        className="alert alert-danger">
                        &nbsp;{this.props.errorLogin}</p>;
        }

        var load;
        if(this.props.loading) {
            load = <center><h5>Loading...</h5></center>;

        } else {
            load = <center><Button color="primary" onClick={this.onBtnSubmit}>Sign In</Button></center>;
        }

        return (
            
          <div>
              <div className="card bg-light">
              <article className="card-body mx-auto" style={{maxWidth: 400}}>
                <br/>
                <form>
                <h5 style={{ textAlign: 'center' }}>LOGIN</h5><br/>
                <div className="form-group input-group">
                  <input ref="username" className="form-control" placeholder="Input username" type="text" />
                </div>
                <div className="form-group input-group">
                  <input ref="password" className="form-control" placeholder="Input password" type="password" />
                </div>
                {alertLog}
                {load}
                </form>
              <br/>
              </article>
            </div>
          
        </div>
        )

      }

      return <Redirect to="/" />

    }
}

const mapStateToProps = (state) => { //===========> NGAMBIL DATA KE GLOBAL STATE
    return { 
      username: state.auth.username, 
      role: state.auth.role,
      email: state.auth.email, 
      errorLogin: state.auth.errorLogin,
      loading: state.auth.loading
     };
}
    
export default connect(mapStateToProps, { onUserLogin })(LoginPage);