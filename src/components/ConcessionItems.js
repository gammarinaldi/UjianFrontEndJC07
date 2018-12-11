import React, { Component } from 'react';
import { connect } from 'react-redux';
import { select_concession } from '../actions';

class ConcessionItems extends Component {

    convertToRupiah = (angka) => {
        var rupiah = '';		
        var angkarev = angka.toString().split('').reverse().join('');
        for(var i = 0; i < angkarev.length; i++) if(i%3 === 0) rupiah += angkarev.substr(i,3)+'.';
        return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
    }

    onItemClick = () => {
        this.props.select_concession(this.props.concession);
    }

    render() {
        const { img, menu, item, price } = this.props.concession;

            return (
                //====================START >> ITEM PRODUK=========================//
                
                <div onClick={this.onItemClick} className="col-md-4 col-sm-6 portfolio-item">
                    <a href style={{ textDecoration: "none" }}>
                        <a className="portfolio-link" data-toggle="modal" href>
                            <img className="img-fluid" src={img} alt="img1" />
                        </a>
                        <div className="portfolio-caption">
                            <h4>{item}</h4>
                            <h6><i>{menu}</i></h6>
                            <p className="text-muted">{this.convertToRupiah(price)}</p>
                        </div>
                    </a>
                </div>
                //====================END >> ITEM PRODUK=========================//
            )
    }
}

export default connect(null, { select_concession })(ConcessionItems);