import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import ConcessionItems from './ConcessionItems';
import { InputGroup, Row, Col } from 'reactstrap';

class ConcessionGridView extends Component {
    
    state = { listConcession: [], searchListConcession: [], totalQty: 0 }

    componentDidMount() {
        this.showConcession();
    }

    showConcession = () => {
        axios.get(API_URL_1 + '/concession')
                .then((res) => {
                    console.log(res);
                    this.setState({ 
                        listConcession: res.data, 
                        searchListConcession: res.data
                    });
                }).catch((err) => {
                    console.log(err);
                })
        }

        onBtnAddToCart = (menu, item, price) => {

            if(this.props.username === "") {
                alert("Please Login First!");
                window.location = "/login"
            } else {
                var qty = parseInt(document.getElementById('addQty').value);
                var idUser = this.props.username;
    
                if(!qty) {
                    alert("Minimum purchase 1 item!");
                } else {
                    axios.post(API_URL_1 + '/cart', {
                        menu, item, price, qty, idUser
                    }).then((res) => {
                        console.log(res);
                        this.showConcession();
                        alert(`Success add to cart: ${qty} item(s)`);
                    }).catch((err) => {
                        console.log(err);
                        alert(`Failed add to cart`);
                    })
                }
            }
    
        }

    convertToRupiah = (angka) => {
        var rupiah = '';		
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 === 0) rupiah += angkarev.substr(i,3)+'.';
        return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
    }

    onBtnSearchClick = () => {
        var menu = this.refs.qMenu.value;
        var item = this.refs.qItem.value;
        var hargaMin = parseInt(this.refs.qHargaMin.value);
        var hargaMax = parseInt(this.refs.qHargaMax.value);
        console.log(hargaMax)

        var arrSearch = this.state.listConcession.filter((e) => {
            return e.menu.includes(menu)
                    && e.price >= hargaMin
                    && e.price <= hargaMax
                    && e.item.toLowerCase().includes(item.toLowerCase())
        })

        this.setState({ searchListConcession: arrSearch })
    }

    renderListConcession = () => {
        
        var listJSXConcession = this.state.searchListConcession.map((e) => {
            return (
                <ConcessionItems concession={e} />
            )
        })
        return listJSXConcession;

    }

    resetForm = () => {
        return document.getElementById("searchForm").reset();
    }

    onClickListView = () => {
        var url= "/concessionlistview"; 
        return window.location = url;
    }

    roleStat = () => {
        if(this.props.myRole === 'admin') {
            return 'Admin Mode';
        }
    }

    render() {
        
        //if(this.props.username !== "") {
            
            if(this.props.concession.id !== 0) {
                return <Redirect to={`/concessiondetails?id=${this.props.concession.id}&menu=${this.props.concession.menu}&item=${this.props.concession.item}`} />
            }

            // var changeToListView = <div className="btn-group" role="group" aria-label="Basic example">
            //                         <button type="button" 
            //                         onClick={() => {this.onClickListView()}}
            //                         className="btn btn-info">Change to List View</button>
            //                         </div>
            //                         ;
            
            return (
                <div className="card bg-light">
                    <article className="card-body mx-auto">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <br/>
                                <h2 className="section-heading text-uppercase">Concession</h2>
                                <h3 className="section-subheading text-muted">Food and Beverage</h3>
                                <div style={{ color: "red" }}>{this.roleStat()}</div>
                                <br/>
                                {/* {changeToListView} */}
                            </div>
                        </div>
                        <br/><br/>
                        <form id="searchForm">
                            <Row>
                                <Col xs="2">
                                    <InputGroup>
                                    <select ref="qMenu" className="custom-select" style={{ margin: '0 20px 0 0' }}>
                                        <option value="">All Menu</option>
                                        <option>Food</option>
                                        <option>Beverage</option>
                                    </select>
                                    </InputGroup>
                                </Col>
                                <Col xs="2">
                                    <InputGroup>
                                    <input type="text" className="form-control" ref="qItem" 
                                    placeholder="Concession" style={{ margin: '0 20px 0 0' }}/>
                                    </InputGroup>
                                </Col>
                                <Col xs="3">
                                    <InputGroup>
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Min Rp</div>
                                    </div>
                                    <input type="number" className="form-control" 
                                    ref="qHargaMin" defaultValue="0" style={{ margin: '0 20px 0 0' }}/>
                                    </InputGroup>
                                </Col>
                                <Col xs="3">
                                    <InputGroup>
                                    <div class="input-group-prepend">
                                        <div class="input-group-text">Max Rp</div>
                                    </div>
                                    <input type="number" className="form-control" 
                                    ref="qHargaMax" defaultValue="999999" style={{ margin: '0 20px 0 0' }}/>
                                    </InputGroup>
                                </Col>
                                <Col xs="1">
                                    <InputGroup>
                                    <input type="button" className="btn btn-success" 
                                    value="Search" onClick={this.onBtnSearchClick} />
                                    </InputGroup>
                                </Col>
                                <Col xs="1">
                                    <InputGroup>
                                    <button className="btn btn-secondary"
                                    onClick={() => {this.resetForm()}}>
                                    <i className="fa fa-undo fa-sm"></i>
                                    </button> 
                                    </InputGroup>
                                </Col>
                            </Row>
                        </form>

                        <br/><br/>
                        <div className="row">
                                {this.renderListConcession()}
                        </div>
                    </article>
                </div>
            );
        //}
        
        //return <Redirect to='/login' />
    }
}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role, concession: state.selectedConcession }
}

export default connect(mapStateToProps)(ConcessionGridView);