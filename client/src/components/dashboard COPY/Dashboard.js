import React,{useEffect,Fragment} from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import {getCurrentProfile} from '../../actions/profile';
const Dashboard = ({auth , profile:{loading,profile} , getCurrentProfile}) => {
    useEffect(() => {
        getCurrentProfile();
      }, [getCurrentProfile]);
    return (
        
        loading && profile===null?<Spinner/>:<Fragment>test</Fragment>
    );
}

Dashboard.propTypes = {
    getCurrentProfile:propTypes.func.isRequired,
    auth:propTypes.object.isRequired,
    profile:propTypes.object.isRequired

}
const mapStateToProps= state =>({
    auth:state.auth,
    profile:state.profile
  });
export default connect(mapStateToProps,{getCurrentProfile})(Dashboard);
