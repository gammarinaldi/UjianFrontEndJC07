import axios from 'axios';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { 
    GET_ALL_MOVIES_SUCCESS,
    REFRESH_SELECT_MOVIE,
    SELECTED_MOVIE
} from './types';

export const getAllMovies = () => {
    return ( dispatch ) => {

        axios.get(API_URL_1 + '/movies')
            .then((response) => {
                dispatch({
                    type: GET_ALL_MOVIES_SUCCESS,
                    payload: response.data
                })
            })
            .catch((err) => {
                console.log(err);
            })
    };
};

export const refreshSelectMovie = () => {
    return {
        type: REFRESH_SELECT_MOVIE
    };
};

export const selectMovie = (movie) => {
    return {
        type: SELECTED_MOVIE,
        payload: movie
    };
};

export const getSpecificMovie = (id) => {
    return(dispatch) => {
        axios.get(API_URL_1 + '/movies/' + id)
            .then((response) => {
                dispatch({
                    type: SELECTED_MOVIE,
                    payload: response.data
                })
            })
            .catch((err) => {
                console.log(err);
            })
    };
};