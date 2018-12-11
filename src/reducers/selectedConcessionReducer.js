import { 
    SELECTED_CONCESSION
} from '../actions/types';

//=================GLOBAL STATE IS HERE====================//
const INITIAL_STATE = { id: 0, menu: '', item: '', price: 0, img: '' };

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SELECTED_CONCESSION:
            return action.payload;
        default :
            return state;
    }
}