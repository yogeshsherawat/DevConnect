import {SET_ALERT , REMOVE_ALERT} from './types';
import { v4 as uuidv4 } from 'uuid';
//import {addSetAlert} from './actionCreator';
// here this set alert function is action creater + dispatcher 
// dispatch function only takes action as argument

export const setAlert = (msg,alertType,timeout=5000) => dispatch =>{
    // generating random universal id using package uuid
    const id = uuidv4();
    // this is to check if separate action work or not
    
    const action = {
        type:SET_ALERT,
        payload:{msg,alertType,id}
    }
    dispatch(action);
    
  /* 
   dispatch({
       type:SET_ALERT,
       payload:{msg,alertType,id}
   })
   */

   // setTime out funciton used for removing alert after 5000 ms
   const action2 = {
       type:REMOVE_ALERT,
       payload:id
   }
   setTimeout(()=>dispatch(action2),timeout)
}



// this is to check if action creator is in different file and it works or not
// this need some research to work
// it did not work properly
/*
export const  setAlert= () => dispatch=>{
    dispatch(addSetAlert);
}
*/