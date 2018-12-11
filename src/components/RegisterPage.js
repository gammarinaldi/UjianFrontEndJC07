import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { onUserRegister } from '../actions';
import { Button } from 'reactstrap';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class RegisterPage extends Component {

    onBtnRegisterClick = () => {
        var username = this.refs.username.value;
        var email = this.refs.email.value;
        var phone = this.refs.phone.value;
        var password = this.refs.password.value;
        this.props.onUserRegister({username, email, phone, password});
    }

    componentWillReceiveProps(newProps) {
        if(newProps.username !== '') {
            cookies.set('usernameCookie', newProps.username, { path: '/' });
        }
    }

    render () {
        if(this.props.username === "") {
            
            var load;
            if(this.props.loading) {
                load = <center><h5>Loading...</h5></center>;
            } else {
                load = <center><Button color="primary" 
                        onClick={this.onBtnRegisterClick}>Register</Button></center>;
            }

            var alertRegister = this.props.errorRegister;

            if(alertRegister) {
                var alertReg = <p align='left' style={{ fontSize: '13px' }} 
                                    className="alert alert-danger">
                                    &nbsp;{this.props.errorRegister}</p>;
              }

            return (
            
                <div>
                    <div className="card bg-light">
                    <article className="card-body mx-auto" style={{maxWidth: 400}}>
                        <h4 className="card-title mt-3 text-center">Register Account</h4><br/>
                        
                        <form>
                            <div className="form-group input-group">
                                <input ref="username" className="form-control" 
                                placeholder="Username" type="text" />
                            </div>
                            <div className="form-group input-group">
                                <input ref="email" className="form-control" 
                                placeholder="Email address" type="email" />
                            </div>
                            <div className="form-group input-group">
                                <input ref="phone" className="form-control" 
                                placeholder="Phone number" type="text" />
                            </div>
                        
                            <div className="form-group input-group">
                                <input ref="password" className="form-control" 
                                placeholder="Create password" type="password" />
                            </div>
                                                                
                            <div className="form-group">
                                {alertReg}
                                {load}
                            </div>      
                        </form>

                        <p className="text-center">Have an account? &nbsp;
                        <Link to="/login">Login</Link> </p>

                    </article>
                    </div>
                </div>
    
            )

        } 
        
        return <Redirect to="/" />

    }
    
}

const mapStateToProps = (state) => {
    return { username: state.auth.username,
             loading: state.auth.loading, 
             errorRegister: state.auth.errorRegister 
            };
}
    
export default connect(mapStateToProps, { onUserRegister })(RegisterPage);