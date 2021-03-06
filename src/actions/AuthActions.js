//===================ACTION CREATOR=====================//
import axios from 'axios';
import { 
    AUTH_LOGIN_SUCCESS,
    AUTH_REGISTER_SUCCESS,
    AUTH_LOADING,
    AUTH_SYSTEM_ERROR,
    AUTH_REGISTER_ERROR,
    AUTH_LOGIN_ERROR,
    LOGOUT,
    COOKIE_CHECKED
} from './types';
import { API_URL_1 } from '../supports/api-url/apiurl';

export const onUserLogin = ({ username, password }) => {

    return ( dispatch ) => {

        dispatch({ type: AUTH_LOADING });
        
        axios.get(API_URL_1 + '/users', { 
            params: {
                username: username,
                password: password
            }
         })
        .then((res) => {
            console.log(res);
            if(res.data.length > 0) {
                dispatch({ type: AUTH_LOGIN_SUCCESS, 
                            payload: { 
                                username: res.data[0].username,
                                role: res.data[0].role, 
                                email: res.data[0].email,
                                phone: res.data[0].phone } });
            } else {
                dispatch({ type: AUTH_LOGIN_ERROR, payload: 'Username or password invalid.' });
            }
        })
        .catch((err) => {
            console.log(err);
            dispatch({ type: AUTH_SYSTEM_ERROR, payload: 'System error.' });
        })

    }

};

export const onUserRegister = ({ username, email, phone, password }) => {

    return ( dispatch ) => {
        
        dispatch({ type: AUTH_LOADING });

        if(username === '' || email === '' || phone === '' || password === '') {
            dispatch({ type: AUTH_REGISTER_ERROR, payload: 'Semua form wajib diisi' });
        } else {
            axios.get(API_URL_1 + '/users', {
                params: {
                    username: username,
                    password: password
                }
            }).then((res) => {

                if(res.data.length === 0) {

                    //================START >> POST DATA TO JSON SERVER=================//
                    axios.post(API_URL_1 + '/users', { 
                        username: username,
                        email: email,
                        phone: phone,
                        password: password,
                        role: 'member'
                    })
                    .then((res) => {
                        console.log(res);
                        dispatch({ type: AUTH_REGISTER_SUCCESS, 
                            payload: { 
                                username: res.data.username,
                                role: res.data.role, 
                                email: res.data.email,
                                phone: res.data.phone } });
                    })
                    .catch((err) => {
                        console.log(err);
                        dispatch({ type: AUTH_SYSTEM_ERROR, payload: 'System error.' });
                    })
                    //================END >> POST DATA TO JSON SERVER=================//

                } else {
                    dispatch( {type: AUTH_REGISTER_ERROR, payload: 'Username sudah ada.'} );
                }

            }).catch((err) => {
                console.log(err);
                dispatch({ type: AUTH_SYSTEM_ERROR, payload: 'System error.' });
            })
        }
        
    }

};

export const keepLogin = (username) => {

    return (dispatch) => {

        axios.get(API_URL_1 + '/users', {
            params: {
                username
            }
        }).then((res) => {
            if(res.data.length > 0) {
                dispatch({
                    type: AUTH_LOGIN_SUCCESS,
                    payload: {  
                        username: res.data[0].username,
                        role: res.data[0].role,
                        email: res.data[0].email,
                        phone: res.data[0].phone
                     }
                })
            }
        })

    }

};

export const onUserLogout = () => {
    return { type: LOGOUT }
};

export const cookieChecked = () => {
    return { type: COOKIE_CHECKED }
};