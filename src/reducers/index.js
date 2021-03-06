import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import MovieListReducer from './MovieListReducer';
import SelectedMovieReducer from './SelectedMovieReducer';
import SelectedConcessionReducer from './selectedConcessionReducer';

export default combineReducers (
    {
        auth: AuthReducer,
        movieList: MovieListReducer,
        selectedMovie: SelectedMovieReducer,
        selectedConcession: SelectedConcessionReducer
    }
);