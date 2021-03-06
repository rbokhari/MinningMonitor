import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => (
    <nav className="navbar header-navbar pcoded-header">
        <div className="navbar-wrapper">
            <div className="navbar-logo">
                <NavLink to='/' style={{color:'white', fontsize:'16px'}}>
                    VE Miner Monitor App
                    {/* <img className="img-fluid" src="gns.jpeg" alt="Theme-Logo" /> */}
                </NavLink>
                {/* <a className="mobile-menu" id="mobile-collapse" href="#!">
                    <i className="feather icon-menu"></i>
                </a> */}
                <a className="mobile-options waves-effect waves-light">
                    <i className="feather icon-more-horizontal"></i>
                </a>
            </div>
            <div className="navbar-container container-fluid">
                <ul className="nav-left">
                    {/* <li>
                        <a href="/" className="waves-effect waves-light">
                            <i className="full-screen feather icon-maximize"></i>
                        </a>
                    </li> */}
                    {/* <li className="header-search">
                        <div className="main-search morphsearch-search">
                            <div className="input-group">
                                <span className="input-group-prepend search-close">
                                    <i className="feather icon-x input-group-text"></i>
                                </span>
                                <input type="text" className="form-control" placeholder="Enter Keyword" />
                                <span className="input-group-append search-btn">
                                    <i className="feather icon-search input-group-text"></i>
                                </span>
                            </div>
                        </div>
                    </li> */}
                </ul>
                <ul className="nav-right">
                    <li className="header-notification">
                        <div className="dropdown-primary dropdown">
                            <div className="dropdown-toggle" data-toggle="dropdown">
                                <i className="feather icon-bell"></i>
                                <span className="badge bg-c-red">5</span>
                            </div>
                            <ul className="show-notification notification-view dropdown-menu" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut">
                                <li>
                                    <h6>Notifications</h6>
                                    <label className="label label-danger">New</label>
                                </li>
                                {/* <li>
                                    <div className="media">
                                        <img className="img-radius" src="/static/images/avatar-4.jpg" alt="Generic placeholder" />
                                        <div className="media-body">
                                            <h5 className="notification-user">Waheed Ali</h5>
                                            <p className="notification-msg">Lorem ipsum dolor sit amet, consectetuer elit.</p>
                                            <span className="notification-time">30 minutes ago</span>
                                        </div>
                                    </div>
                                </li> */}
                            </ul>
                        </div>
                    </li>
                    <li className="user-profile header-notification">
                        <div className="dropdown-primary dropdown">
                            <div className="dropdown-toggle" data-toggle="dropdown">
                                {/* <i className="icon feather icon-settings"></i> */}
                                <span>Rahman Bokhari</span>
                                {/* <i className="feather icon-chevron-down"></i> */}
                            </div>
                            {/* <ul className="show-notification profile-notification dropdown-menu" data-dropdown-in="fadeIn" data-dropdown-out="fadeOut">
                                <li className="drp-u-details">
                                    <img src="assets/images/avatar-4.jpg" className="img-radius" alt="User-Profile" />
                                    <span>Rahman Bokhari</span>
                                    <a href="auth-sign-in-social.html" className="dud-logout" title="Logout">
                                        <i className="feather icon-log-out"></i>
                                    </a>
                                </li>
                            </ul> */}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

export default Header;