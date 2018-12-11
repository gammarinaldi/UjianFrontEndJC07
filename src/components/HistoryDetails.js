import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';

class HistoryDetails extends Component {

    state = { listOrderDetails: [] }

    componentDidMount() {
        this.showOrderDetails();
    }

    invoiceId = () => {
        var params = queryString.parse(this.props.location.search);
        return params.invoiceId;
    }

    showOrderDetails = () => {
    axios.get(API_URL_1 + '/orderdetails?invoiceId=' + this.invoiceId())
            .then((res) => {
                console.log(res);
                this.setState({ 
                    listOrderDetails: res.data
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
  
    renderListOrderDetails = () => {
        var listJSXOrderDetails = this.state.listOrderDetails.map((item, i) => {

            return (
                <tr>   
                    <td><center>{item.itemDetails[i].id}</center></td>
                    <td><center>{item.itemDetails[i].menu}</center></td>
                    <td><center>{item.itemDetails[i].item}</center></td>
                    <td><center><img src={item.itemDetails[i].img} alt={item.itemDetails[i].menu} width="150px" height="100px" /></center></td>
                    <td><center>{item.itemDetails[i].qty}</center></td>
                    <td><center>{this.convertToRupiah(item.itemDetails[i].price)}</center></td>
                </tr>
            )
        })
        
        return listJSXOrderDetails;
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
                            <h2 className="section-heading text-uppercase">Transaction Details</h2>
                            <h3 className="section-subheading text-muted">{this.invoiceId()}</h3>
                            <div style={{ color: "red" }}>{this.roleStat()}</div>
                        </div>
                        <br/>
                        <div class="table-responsive">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col"><center>Id</center></th>
                                        <th scope="col"><center>Menu</center></th>
                                        <th scope="col"><center>Item</center></th>
                                        <th scope="col"><center>Image</center></th>
                                        <th scope="col"><center>Harga</center></th>
                                        <th scope="col"><center>Qty</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.renderListOrderDetails()}
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
    return { username: state.auth.username }
}

export default connect(mapStateToProps)(HistoryDetails);