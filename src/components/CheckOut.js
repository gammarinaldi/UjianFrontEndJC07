import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';

class CheckOut extends Component {

    state = { listCart: [] }

    totalHarga = () => {
        var totalHarga = 0;
        for(let i = 0; i < this.state.listCart.length; i++) {
            totalHarga += this.state.listCart[i].qty * this.state.listCart[i].price;
        }
        return totalHarga;
    }

    totalQty = () => {
        var totalQty = 0;
        for(let i = 0; i < this.state.listCart.length; i++) {
            totalQty += this.state.listCart[i].qty;
        }
        return totalQty;
    }
    

    componentDidMount() {
        this.showCart();
    }

    deleteCart = () => {
        //======> DELETE CART
        for(let i = 0; i < this.state.listCart.length; i++){
            axios.delete(API_URL_1 + '/supercart/' + this.state.listCart[i].id    
            ).then((res) => {
                console.log(res)     
                alert('Cart deleted');   
            }).catch((err) => {
                console.log(err);
            })
        }
    }

    onBtnPayment = () => {

        const payment = parseInt(this.refs.payment.value);

        if(!payment) {
            alert('Please input amount of payment');
        } else {
            const change = payment - this.totalHarga();
            if(change < 0 ) {
                return alert('Insuffucient payment');
            } else {

                var totalPrice = this.totalHarga();
                var totalQty = this.totalQty();

                var currentdate = new Date();
                var datetime = currentdate.getDate() + "/" +
                    (currentdate.getMonth() + 1) + "/" +
                    currentdate.getFullYear() + " @ " +
                    currentdate.getHours() + ":" +
                    currentdate.getMinutes() + ":" +
                    currentdate.getSeconds();

                var invoiceId = 
                `INV/${this.props.username}/${currentdate.getFullYear()}/${currentdate.getMonth()}/${currentdate.getDate()}/${currentdate.getHours()}${currentdate.getMinutes()}${currentdate.getSeconds()}`;
                
                //======> POST TO TABLE ORDERS
                axios.post(API_URL_1 + '/orders', {
                    userId: this.props.username,
                    invoiceId: invoiceId,
                    trxDate: datetime,
                    totalQty: totalQty,
                    totalPrice: totalPrice
                })

                //======> POST TO TABLE ORDER DETAILS
                axios.post(API_URL_1 + '/orderdetails', {
                    invoiceId: invoiceId,
                    itemDetails: this.state.listCart
                }).then((resOD) => {
                    console.log(resOD)
                    // //======> DELETE CART
                    // for(let i = 0; i < this.state.listCart.length; i++){
                    //     axios.delete(API_URL_1 + '/supercart/' + this.state.listCart[i].id)
                    //     .then((resDL) => {
                    //         console.log(resDL)     
                    //         alert('Cart deleted');   
                    //     })
                    // }
                })

                alert('Your change: ' + this.convertToRupiah(change) + ' , Thank you!');

                return window.location = '/';

            }
        }

    }

    showCart = () => {
        axios.get(API_URL_1 + '/supercart?idUser=' + this.props.username)
                .then((res) => {
                    console.log(res);
                    this.setState({ 
                        listCart: res.data
                    });
                }).catch((err) => {
                    console.log(err);
                })
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

            return (
                <tr>
                    <td><center>{item.id}</center></td>
                    <td>{item.menu}</td>
                    <td>{item.item}</td>
                    <td>{this.convertToRupiah(item.price)}</td>
                    <td><center>{item.qty}</center></td>
                    <td>{this.convertToRupiah(item.price*item.qty)}</td>
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
                    <h2 className="section-heading text-uppercase">Checkout</h2>
                    <h4 className="section-subheading text-muted">Summary and Payment</h4>
                    </div>
                    <br/>
                    <center>
                        <div class="table-responsive col-lg-8">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col"><center>ID</center></th>
                                        <th scope="col"><center>Menu</center></th>
                                        <th scope="col"><center>Item</center></th>
                                        <th scope="col"><center>Price</center></th>
                                        <th scope="col"><center>Qty</center></th>
                                        <th scope="col"><center>Sub-Total</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.renderListCart()}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="8">
                                            <div align="center"><h5>TOTAL : {this.convertToRupiah(this.totalHarga())}</h5></div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan="8">
                                            <div align="center">
                                                <h5>
                                                    Input Amount: <br/><br/>
                                                <div align="center">
                                                    <input type="number" ref="payment"
                                                    className="form-control form-control-lg" />
                                                </div>
                                                <br/>
                                                <button className="btn btn-success"
                                                    onClick={ () => this.onBtnPayment() }>
                                                <i className="fa fa-check fa-sm"></i>
                                                &nbsp; PAY
                                                </button>
                                                </h5>
                                            </div>
                                        </td>
                                    </tr>

                                </tfoot>
                            </table>
                        </div>
                    </center>
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
    return { username: state.auth.username }
}

export default connect(mapStateToProps)(CheckOut);