import React, { Fragment } from 'react';
import {Link } from 'react-router-dom';
import { logout } from '../../actions/auth';
import {connect} from 'react-redux';
import propTypes from 'prop-types';
const Navbar=({ auth:{ isAuthenticated , loading } , logout })=>{
  const handleLogOut=()=>{
    logout();
    
  }
  const AuthLinks=(
    <ul>
    
    <li><Link to="/profiles">Developers</Link></li>
      <li><Link  to="/dashboard"><i className="fas fa-user"></i>{' '}
      <span className='hide-sm'>Dashboard</span></Link></li>
      <li><Link onClick={handleLogOut} to="!#"><i className="fas fa-sign-out-alt"></i>{' '}
      <span className='hide-sm'>Log Out</span></Link></li>
      
    </ul>
    
  );
  const GuestLinks=(
    <ul>
      <li><Link to="/profiles">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );
    return(
        
        <nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
      </h1>
      <Fragment> {isAuthenticated?AuthLinks:GuestLinks}</Fragment>
    </nav>

       
    )
}

Navbar.propTypes={
  logout:propTypes.func.isRequired,
  auth:propTypes.object.isRequired
}
const mapStateToProps= state =>({
  auth:state.auth
});

export default connect(mapStateToProps,{logout})(Navbar);