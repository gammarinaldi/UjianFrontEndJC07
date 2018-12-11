import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllMovies, refreshSelectMovie } from '../actions';
import CarouselBro from './Carousel';

class HomePage extends Component {

    componentDidMount() {
        this.props.getAllMovies();
        this.props.refreshSelectMovie();
    }

    render() {

        var msg1, msg2, msg3, msg4;
        if(this.props.username !== "") {
            msg1 = 'Selamat datang, ' + this.props.username + ' (' + this.props.role + ')';
            msg2 = 'Email : ' + this.props.email;
            msg3 = 'Phone : ' + this.props.phone;

        } else {
            msg1 = 'You are not logged in.';
            msg2 = '';
            msg3 = '';
        }

        if(this.props.listMovies.length >= 3) {
            msg4 = <CarouselBro 
                        legend1={this.props.listMovies[0].title} 
                        image1={this.props.listMovies[0].image} 
                        legend2={this.props.listMovies[1].title} 
                        image2={this.props.listMovies[1].image} 
                        legend3={this.props.listMovies[2].title} 
                        image3={this.props.listMovies[2].image}
                        listMovie={this.props.listMovies}
                    />
        }
    
        return (
          <div className="card bg-light">
            <article className="card-body mx-auto">
              <h5><center>{msg1}</center></h5>
                  {msg2}<br/>
                  {msg3}<br/><br/>
                  {msg4}
            </article>
          </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        role: state.auth.role,
        email: state.auth.email,
        phone: state.auth.phone,
        listMovies: state.movieList
    }
  }
  
  export default connect(mapStateToProps, { getAllMovies, refreshSelectMovie })(HomePage);