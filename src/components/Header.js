import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
    } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { onUserLogout } from '../actions';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class HeaderReact extends Component {

    state = { listCart: [] }

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    onLogoutSelect = () => {
        if(window.confirm('Are you sure want to Logout?')) {
            this.props.onUserLogout();
            cookies.remove('usernameCookie', 'emailCookie', 'roleCookie');
            alert('Logout success');
            window.location = '/';
        }
    }

    render() {
        console.log('Username header: ' + this.props.username);
        if(this.props.username === "") {

            return (
                <div style={{ margin: '0 0 70px 0' }}>
                    <Navbar color="light" light expand="md" fixed="top">
                    <NavbarBrand href="/">{this.props.NavBrand}</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>

                        <NavItem>
                        <Link to="/register"><NavLink>Register</NavLink></Link>
                        </NavItem>
                        <NavItem>
                        <Link to="/login"><NavLink>Login</NavLink></Link>
                        </NavItem>

                        </Nav>
                    </Collapse>
                    </Navbar>
                </div>
            )

        } else {
            return (
                
                <div style={{ margin: '0 0 70px 0' }}>
                    <Navbar color="light" light expand="md" fixed="top">
                    <NavbarBrand href="/">{this.props.NavBrand}</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>

                        <NavItem>
                        <NavLink>Hello, {this.props.username}</NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink href="/concessiongridview">Concession</NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink href="/cart">Cart</NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink href="/history">History</NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink href="#" onClick={this.onLogoutSelect}>Logout</NavLink>
                        </NavItem>
                        
                        </Nav>
                    </Collapse>
                    </Navbar>
                </div>
            )
        }
        
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        role: state.auth.role
    }
}

export default connect(mapStateToProps, { onUserLogout })(HeaderReact);