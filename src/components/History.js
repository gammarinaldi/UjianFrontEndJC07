import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';

class History extends Component {

    state = { listOrders: [] }

    componentDidMount() {
        this.showOrders();
    }

    showOrders = () => {
    axios.get(API_URL_1 + '/orders')
            .then((res) => {
                console.log(res);
                this.setState({ 
                    listOrders: res.data
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    convertToRupiah = (angka) => {
        var rupiah = '';		
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 === 0) rupiah += angkarev.substr(i,3)+'.';
        return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
    }

    onBtnOrderDetails = (invoiceId) => {
        window.location = '/historydetails?invoiceId=' + invoiceId;
    }
  
    renderListOrders = () => {
        var listJSXOrders = this.state.listOrders.map((item) => {

            return (
                <tr>   
                    <td><center>{item.id}</center></td>
                    <td><center>{item.invoiceId}</center></td>
                    <td><center>{item.userId}</center></td>
                    <td>{item.trxDate}</td>
                    <td>{item.totalQty}</td>
                    <td>{this.convertToRupiah(item.totalPrice)}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={ () => this.onBtnOrderDetails(item.invoiceId) }>
                        <i className="fa fa-th fa-sm"></i>
                        &nbsp; Details
                        </button>
                    </td>
                </tr>
            )

        })
        
        return listJSXOrders;
    }

    roleStat = () => {
        if(this.props.myRole === 'admin') {
            return 'Admin Mode';
        }
    }
        
    render() {
        
        if(this.props.username !== "") {
            
            return(
                <div className="card bg-light">
                    <article className="card-body mx-auto">
                        <div className="col-lg-12 text-center">
                            <h2 className="section-heading text-uppercase">Transaction History</h2>
                            <h3 className="section-subheading text-muted">Details</h3>
                            <div style={{ color: "red" }}>{this.roleStat()}</div>
                        </div>
                        <br/>
                        <div class="table-responsive">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col"><center>Trx Id</center></th>
                                        <th scope="col"><center>Invoice Id</center></th>
                                        <th scope="col"><center>User Id</center></th>
                                        <th scope="col"><center>Trx Time</center></th>
                                        <th scope="col"><center>Total Qty</center></th>
                                        <th scope="col"><center>Total Price</center></th>
                                        <th scope="col" colSpan="2"><center>Action</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.renderListOrders()}
                                </tbody>
                            </table>
                        </div>
                    </article>
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
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps)(History);