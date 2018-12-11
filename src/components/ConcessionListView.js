import React, { Component } from 'react';
import axios from 'axios';
import { InputGroup, Row, Col, Input } from 'reactstrap';
//import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';

class ConcessionListView extends Component {

    constructor(props) {
        super(props);
        
        this.addQty = React.createRef();
        
    }

    state = { listConcession: [], selectedIdEdit: 0, searchListConcession: [], filterForm: '', value: '' }

    componentDidMount() {
        this.showConcession();
    }

    showConcession = () => {
    axios.get(API_URL_1 + '/concession')
            .then((res) => {
                console.log(res);
                this.setState({ 
                    listConcession: res.data, 
                    searchListConcession: res.data, 
                    selectedIdEdit: 0 
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    onBtnAddClick = () => {
        const menu = this.refs.addMenu.value;
        const item = this.refs.addItem.value;
        const price = this.refs.addPrice.value;
        const img = this.refs.addImg.value;

        axios.post(API_URL_1 + '/concession', {
            menu, item, price, img
        }).then((res) => {
            console.log(res);
            this.showConcession();
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnSaveClick = (id) => {
        const menu = this.refs.updateMenu.value;
        const item = this.refs.updateItem.value;
        const price = this.refs.updatePrice.value;
        const img = this.refs.updateImg.value;

        axios.put(API_URL_1 + '/concession/' + id, {
            menu, item, price, img
        }).then((res) => {
            console.log(res);
            this.showConcession();
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (id, menu, item) => {
        if(window.confirm('Are you sure want to delete: ' + menu + ' ' + item + ' ?')) {
            axios.delete(API_URL_1 + '/concession/' + id)
                .then((res) => {
                    console.log(res);
                    this.showConcession();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    
    onBtnAddToCart = (menu, item, price, img) => {

        if(this.props.username === "") {
            alert("Please Login First!");
            window.location = "/login"
        } else {

            const qty = parseInt(this.refs.addQty.refs.innerqty.value);
            var idUser = this.props.username;

            alert(qty)

            if(!qty) {
                alert("Minimum purchase 1 item!");
            } else {
                axios.post(API_URL_1 + '/cart', {
                    menu, item, price, qty, idUser, img
                }).then((res) => {
                    console.log(res);
                    this.showConcession();
                    alert(`Success add to cart: ${qty} item(s)`);
                    window.location = "/concessionlistview";
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

    onKeyUpSearch = () => {
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

        //this.setState({ filterForm: this.refs.qItem.value });
    }

    filterConcession = () => {
        var filterList;

        filterList = this.state.listConcession.filter((item) => {
            return (
                item.menu.toLowerCase().includes(this.state.filterForm.toLowerCase())
            )
        })

        if(filterList.length === 0) {
            filterList = this.state.listConcession.filter((item) => {
                return (
                    item.item.toLowerCase().includes(this.state.filterForm.toLowerCase())
                )
            })
        }

        return filterList;
    }

    adminAddAction = () => {
        if(this.props.myRole === 'admin') {
            return(
                <tfoot>
                    <tr>
                        <td><center><button className="btn btn-success" onClick={() => this.onBtnAddClick()}>
                            <i className="fa fa-plus"></i> Add</button></center></td>
                        <td><input type="text" size="8" placeholder="Input menu" ref="addMenu" 
                            className="form-control" /></td>
                        <td><input type="text" size="8" placeholder="Input item" ref="addItem" 
                            className="form-control" /></td>
                        <td><input type="number" placeholder="Input price" ref="addPrice"
                            className="form-control"/></td>
                        <td><input type="text" size="8" placeholder="Input image link" ref="addImg"
                            className="form-control"/></td>
                        <td><center><button className="btn btn-success" onClick={() => this.onBtnAddClick()}>
                            <i className="fa fa-plus"></i> Add</button></center></td>
                    </tr>
                </tfoot>
            )
        }
    }
  
    renderListConcession = () => {
        var listJSXConcession = this.state.searchListConcession.map((item, i) => {

        //====================START >> EDIT ITEM PRODUK=========================//
        if(item.id === this.state.selectedIdEdit) {
            return (
                <tr>
                    <td>{item.id}</td>
                    <td><input type="text" defaultValue={item.menu} size="4"
                    ref="updateMenu" className="form-control" /></td>
                    <td><input type="text" defaultValue={item.item} size="4"
                    ref="updateItem" className="form-control" /></td>
                    <td><input type="number" defaultValue={item.price} 
                    ref="updatePrice" className="form-control" /></td>
                    <td><input type="text" defaultValue={item.img} size="4"
                    ref="updateImg" className="form-control" /></td>
                    <td>
                        <center>
                        <button className="btn btn-success"
                            onClick={() => this.onBtnSaveClick(item.id)}>
                            <i className="fa fa-save fa-sm"></i>
                        </button>
                        &nbsp;
                        <button className="btn btn-secondary"
                            onClick={() => this.setState( { selectedIdEdit:0 } )}>
                            <i className="fa fa-times fa-sm"></i>
                        </button>
                        </center>
                    </td>
                </tr>
            )
        }
        //====================END >> EDIT ITEM PRODUK=========================//

        if(this.props.myRole === "admin") {
            return (
                <tr>
                    <td><center>{item.id}</center></td>
                    <td>{item.menu}</td>
                    <td>{item.item}</td>
                    <td>{this.convertToRupiah(item.price)}</td>
                    <td><center><img src={item.img} alt={item.menu} width="150px" height="100px" /></center></td>
                    <td>
                        <center>
                        <button className="btn btn-info" 
                            onClick={ () => this.setState({ selectedIdEdit: item.id }) }>
                            <i className="fa fa-edit fa-sm"></i>
                        </button>
                        &nbsp;
                        <button className="btn btn-danger"
                            onClick={ () => this.onBtnDeleteClick(item.id, item.menu, item.item, item.img) }>
                            <i className="fa fa-trash fa-sm"></i>
                        </button>
                        </center>
                    </td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td><center>{item.id}</center></td>
                    <td>{item.menu}</td>
                    <td>{item.item}</td>
                    <td>{this.convertToRupiah(item.price)}</td>
                    <td><center><img src={item.img} alt={item.menu} width="150px" height="100px" /></center></td>
                    
                    <td>
                        <center>
                        <Input type="number" ref="addQty" innerRef="innerqty" placeholder="Input Qty" />
                        </center>
                    </td>
                    <td><center>
                        <button className="btn btn-success"
                            onClick={ () => this.onBtnAddToCart(
                                item.menu,
                                item.item,
                                item.price,
                                item.img
                            ) }>
                        <i className="fa fa-shopping-cart fa-sm"></i>
                        </button>  
                        </center>
                    </td>

                </tr>
            )
        }

        })
        
        return listJSXConcession;
    }

    resetForm = () => {
        return document.getElementById("searchForm").reset();
    }

    onClickGridView = () => {
        var url= "/concessiongridview"; 
        return window.location = url;
    }

    roleStat = () => {
        if(this.props.myRole === 'admin') {
            return 'Admin Mode';
        }
    }
        
    render() {
        
        //if(this.props.username !== "") {
            
            return(
                <div className="card bg-light">
                    <article className="card-body mx-auto">
                        <div className="col-lg-12 text-center">
                            <h2 className="section-heading text-uppercase">Concession</h2>
                            <h3 className="section-subheading text-muted">Food and Beverage</h3>
                            <div style={{ color: "red" }}>{this.roleStat()}</div>
                        </div>
                        <br/>
                        <center>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" 
                            onClick={() => {this.onClickGridView()}}
                            className="btn btn-info">Change to Grid View</button>
                        </div>
                        </center>
                        <br/>
                        <form id="searchForm">
                        <Row>
                            <Col xs="2">
                            <InputGroup>
                                <select ref="qMenu" className="custom-select" 
                                style={{ margin: '0 20px 0 0' }} onChange={() => {this.onKeyUpSearch()}}>
                                    <option value="">All Menu</option>
                                    <option>Food</option>
                                    <option>Beverage</option>
                                </select>
                            </InputGroup>
                            </Col>
                            <Col xs="2">
                            <InputGroup>
                                <input type="text" className="form-control" 
                                placeholder="Find concession"
                                ref="qItem" onKeyUp={() => {this.onKeyUpSearch()}} />
                            </InputGroup>
                            </Col>
                            <Col xs="3">
                            <InputGroup>
                                <div class="input-group-prepend">
                                    <div class="input-group-text">Min Rp</div>
                                </div>
                                <input type="number" className="form-control" 
                                ref="qHargaMin" defaultValue="0" 
                                style={{ margin: '0 20px 0 0' }} onKeyUp={() => {this.onKeyUpSearch()}} />
                            </InputGroup>
                            </Col>
                            <Col xs="3">
                            <InputGroup>
                                <div class="input-group-prepend">
                                    <div class="input-group-text">Max Rp</div>
                                </div>
                                <input type="number" className="form-control" 
                                ref="qHargaMax" defaultValue="999999" 
                                style={{ margin: '0 20px 0 0' }} onKeyUp={() => {this.onKeyUpSearch()}} />
                            </InputGroup>
                            </Col>
                            <Col xs="1">
                            <InputGroup>
                                <button className="btn btn-secondary"
                                    onClick={() => {this.resetForm()}}>
                                <i className="fa fa-undo fa-sm"></i>
                                &nbsp;Reset search
                                </button>
                            </InputGroup>
                            </Col>
                        </Row>
                        </form>
                        <br/>
                        <div class="table-responsive">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col"><center>ID</center></th>
                                        <th scope="col"><center>Menu</center></th>
                                        <th scope="col"><center>Item</center></th>
                                        <th scope="col"><center>Price</center></th>
                                        <th scope="col"><center>Image</center></th>
                                        <th scope="col" colSpan="2"><center>Action</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.renderListConcession()}
                                </tbody>
                                        {this.adminAddAction()}
                            </table>
                        </div>
                    </article>
                </div>
            )
        // } else {
        //     return (
        //         <Redirect to="/login" />
        //     )
        // }
    }

}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps)(ConcessionListView);