import {GET_PROFILE,PROFILE_ERROR, CLEAR_PROFILE} from '../actions/types';

const initialState={
    profile:null,
    profiles:[],
    loading:true,
    repos:[],
    error:{}
}

export default function(state=initialState,action){
    const {type,payload} = action;
    switch(type){
        case GET_PROFILE:
            return({
                ...state,
                loading:false,
                profile:payload
            })
        case PROFILE_ERROR:
            return({
            ...state,
            loading:false,
            error:payload
        });
        case CLEAR_PROFILE:
            return({
                ...state,
                loading:false,
                profile:null,
                repos:[]
            })
        default:
            return state;
        
    }

}