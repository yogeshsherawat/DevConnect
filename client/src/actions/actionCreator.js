import {SET_ALERT,REMOVE_ALERT} from './types';
import { v4 as uuidv4 } from 'uuid';
// this is action creator file that is it only creates aciton
const addSetAlert = (alertType,msg)=>{
    const id = uuidv4();
    return({
        type:SET_ALERT,
        payload:{msg,alertType,id}
    })
}
export {addSetAlert};