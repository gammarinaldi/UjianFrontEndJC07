//===================ACTION CREATOR=====================//
import { 
    SELECTED_CONCESSION
} from './types';

export const select_concession = (selectedConcession) => {
    return {
        type: SELECTED_CONCESSION,
        payload: selectedConcession
    }
}