import React from "react";
import {Link,Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {loadUser} from '../../actions/auth';
const Landing=({isAuthenticated,loadUser})=>{
  function handleClick(){
    loadUser();
  }
  if(isAuthenticated)
  return<Redirect to='/dashboard'/>

    return(

            <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Developer Connector</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-light">Login</Link>
            <Link to="#" className="btn btn-light" onClick={handleClick}>Test</Link>
          </div>
        </div>
      </div>
    </section>
        
    )
}
Landing.propTypes ={
  isAuthenticated:propTypes.bool,
  loadUser:propTypes.func.isRequired
}
const mapStateToProps= state =>({
  isAuthenticated:state.auth.isAuthenticated
});
export default connect(mapStateToProps,{loadUser})(Landing);