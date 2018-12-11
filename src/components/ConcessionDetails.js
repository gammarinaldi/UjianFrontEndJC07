import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { select_concession } from '../actions';
import queryString from 'query-string';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { Media } from 'reactstrap';

class ConcessionDetails extends Component {

    state = {  totalQty: 0 }

    componentDidMount() {
        var params = queryString.parse(this.props.location.search);
        console.log(params);
        var concessionId = params.id;
        axios.get(API_URL_1 + '/concession/' + concessionId)
                .then((res) => {
                    this.props.select_concession(res.data);
                })
                .catch((err) => {
                    console.log(err);
                })
    }

    convertToRupiah = (angka) => {
        var rupiah = '';		
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 === 0) rupiah += angkarev.substr(i,3)+'.';
        return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
    }

    onBtnAddToCart = (menu, item, price, img) => {

        if(this.props.username === "") {
            alert("Please Login First!");
            window.location = "/login"
        } else {
            var qty = parseInt(document.getElementById('addQty').value);
            var idUser = this.props.username;

            axios.post(API_URL_1 + '/supercart', {
                menu, item, price, qty, idUser, img
            }).then((res) => {
                console.log(res);
                alert(`Success add to cart: ${qty} item(s)`);
                window.location = "/";
            }).catch((err) => {
                console.log(err);
                alert(`Failed add to cart`);
            })
        }

    }

    render() {

        var { menu, item, price, img} = this.props.concession;
        return(
                <div className="card bg-light" style={{padding:"30px"}}>
                    <article>
                        <Media>
                            <Media left>
                                <img className="img-responsive" alt={item} 
                                src={img} style={{ marginRight: "20px" }}/>
                            </Media>
                            <Media body>
                                <Media heading>
                                <h2>{item}</h2>
                                </Media>
                                <h5 className="section-subheading text-muted">{menu}</h5>
                                <h4>{this.convertToRupiah(price)}</h4>
                                <br/>
                                <table>
                                    <tr>
                                        <td>
                                            <input type="number" placeholder="Input Qty" ref="addQty" id="addQty" 
                                            className="form-control" />
                                        </td>
                                        <td>&nbsp;</td>
                                        <td>
                                            <button className="btn btn-success"
                                                onClick={ () => this.onBtnAddToCart(
                                                    menu,
                                                    item,
                                                    price,
                                                    img
                                                ) }>
                                            <i className="fa fa-shopping-cart fa-sm"></i>
                                            &nbsp; Add to cart
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                                
                            </Media>
                        </Media>
                    </article>
                </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { username: state.auth.username, concession: state.selectedConcession }
}

export default connect(mapStateToProps, { select_concession })(ConcessionDetails);