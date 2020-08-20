
import {SET_ALERT,REMOVE_ALERT} from '../actions/types';

const initialState = [];
// reducers need two parameters 1.Initial State 2.Action and output is final state
export default function(state=initialState,action){
    const {type,payload} = action;
    switch(type){
        case SET_ALERT:
            return [...state,payload];
        case REMOVE_ALERT:
            return state.filter(alert=> alert.id!==payload);
        default:
            return state;
 
    }
}


