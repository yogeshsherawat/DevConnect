import {PROFILE_ERROR , GET_PROFILE} from './types';
import axios from 'axios';
import {setAlert} from './alert';



export const getCurrentProfile = () => async dispatch => {
    try{
        const res =await axios.get('/api/profile/me');
        console.log(data);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        })
    }
    catch(err){
        dispatch({
            type:PROFILE_ERROR,
            payload:{msg:err.response.statusText , status:err.response.status}
        });

    }
}