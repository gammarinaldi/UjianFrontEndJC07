import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';

class ConcessionListView extends Component {

    state = { listCart: [], selectedIdEdit: 0 }

    totalHarga = () => {
        var total = 0;
        for(let i = 0; i < this.state.listCart.length; i++) {
            total += this.state.listCart[i].qty * this.state.listCart[i].price;
        }
        return total;
    }
    

    componentDidMount() {
        this.showCart();
    }

    onBtnCheckout = () => {
        window.confirm('Are you sure want to checkout?');
        window.location = '/checkout';
    }

    showCart = () => {
        axios.get(API_URL_1 + '/supercart?idUser=' + this.props.username)
                .then((res) => {
                    console.log(res);
                    this.setState({ 
                        listCart: res.data,
                        selectedIdEdit: 0 
                    });
                }).catch((err) => {
                    console.log(err);
                })
    }

    onBtnSaveClick = (id) => {
        const idUser = this.refs.updateIdUser.value;
        const menu = this.refs.updateMenu.value;
        const item = this.refs.updateItem.value;
        const img = this.refs.updateImg.value;
        const price = parseInt(this.refs.updatePrice.value);
        const qty = parseInt(this.refs.updateQty.value);

        axios.put(API_URL_1 + '/supercart/' + id, {
            idUser, menu, item, price, img, qty
        }).then((res) => {
            console.log(res);
            this.showCart();
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (id, menu, item) => {
        if(window.confirm('Are you sure want to delete: (' + menu + ') ' + item + ' ?')) {
            axios.delete(API_URL_1 + '/supercart/' + id)
                .then((res) => {
                    console.log(res);
                    this.showCart();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    convertToRupiah = (angka) => {
        var rupiah = '';		
        var angkarev = angka.toString().split('').reverse().join('');
        for (var i = 0; i < angkarev.length; i++) {
            if (i%3 === 0) {
                rupiah += angkarev.substr(i,3)+'.';
            }
        }
        return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
    }
  
    renderListCart = () => {
        
        var listJSXCart = this.state.listCart.map((item) => {

            //====================START >> EDIT ITEM PRODUK=========================//
            if(item.id === this.state.selectedIdEdit) {
                return (
                    <tr>
                        <td><center>{item.id}</center></td>
                        <input type="hidden" ref="updateIdUser" defaultValue={item.idUser} />
                        <td>{item.menu}<input type="hidden" ref="updateMenu" defaultValue={item.menu} /></td>
                        <td>{item.item}<input type="hidden" ref="updateItem" defaultValue={item.item} /></td>
                        <td>{this.convertToRupiah(item.price)}
                        <input type="hidden" ref="updatePrice" defaultValue={item.price} /></td>
                        <td><center><img src={item.img} alt={item.menu} width="150px" height="100px" /></center>
                        <input type="hidden" ref="updateImg" defaultValue={item.img} /></td>
                        <td><input type="number" defaultValue={item.qty}  size="4" 
                        ref="updateQty" className="form-control" /></td>
                        <td>{this.convertToRupiah(item.price*item.qty)}</td>
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

            return (
                <tr>
                    <td><center>{item.id}</center></td>
                    <td>{item.menu}</td>
                    <td>{item.item}</td>
                    <td>{this.convertToRupiah(item.price)}</td>
                    <td><center><img src={item.img} alt={item.menu} width="150px" height="100px" /></center></td>
                    <td><center>{item.qty}</center></td>
                    <td>{this.convertToRupiah(item.price*item.qty)}</td>
                    <td>
                        <center>
                        <button className="btn btn-info" 
                            onClick={ () => this.setState({ selectedIdEdit: item.id }) }>
                            <i className="fa fa-edit fa-sm"></i>
                        </button>
                        &nbsp;
                        <button className="btn btn-danger"
                            onClick={ () => this.onBtnDeleteClick(item.id, item.menu, item.item) }>
                            <i className="fa fa-trash fa-sm"></i>
                        </button>
                        </center>
                    </td>
                </tr>
            )

        })
        
        return listJSXCart;
    }
        
    render() {
        
        if(this.props.username !== "") {
            
            return(
                <div>
                    <div className="col-lg-12 text-center">
                    <h2 className="section-heading text-uppercase">Cart</h2>
                    <h3 className="section-subheading text-muted">Check again before you checkout</h3>
                    </div>
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
                                    <th scope="col"><center>Qty</center></th>
                                    <th scope="col"><center>Sub-Total</center></th>
                                    <th scope="col"><center>Action</center></th>
                                </tr>
                            </thead>
                            <tbody>
                                    {this.renderListCart()}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="8">
                                        <div align="right"><h5>TOTAL : {this.convertToRupiah(this.totalHarga())}</h5></div>
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan="8">
                                        <div align="right">
                                            <h5>
                                            <button className="btn btn-success"
                                                onClick={ () => this.onBtnCheckout() }>
                                            <i className="fa fa-check fa-sm"></i>
                                            &nbsp; CHECKOUT
                                            </button>
                                            </h5>
                                        </div>
                                    </td>
                                </tr>;

                            </tfoot>
                        </table>
                    </div>
                </div>
            )
        } else {
            return (
                <Redirect to="/login" />
            )
        }
    }

}

const mapStateToProps = (state) => {
    return { username: state.auth.username, role: state.auth.role }
}

export default connect(mapStateToProps)(ConcessionListView);