import React from 'react';
import { NavLink } from 'react-router-dom';
import NavItem from './navItem';

const Menu = () => (
    <nav className="pcoded-navbar">
        <div className="nav-list">
            <div className="pcoded-inner-navbar main-menu">
            <div className="pcoded-navigation-label" menu-title-theme="theme6">Main Menu</div>
                <ul className="pcoded-item pcoded-left-item">
                    {/* <NavItem to="/" onlyActiveOnIndex index={true}>
						<i className="menu-icon fa fa-tachometer"></i>
						<span className="menu-text">
                        <span>Dashboard</span>
						</span>					
					</NavItem> */}
                    <li className="">
                        <NavLink to="/" className="">
                            <span className="pcoded-micon"><i className="feather icon-home"></i></span>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                </ul>
                <ul className="pcoded-item pcoded-left-item">
                    <li className="">
                        <NavLink to="/miners" className="waves-effect waves-dark" activeClassName="active">
                            <span className="pcoded-micon"><i className="feather icon-power"></i></span>
                            <span>Miners Online</span>
                        </NavLink>
                    </li>
                </ul>
                <ul className="pcoded-item pcoded-left-item">
                    <li className="">
                        <NavLink to="/groups" className="waves-effect waves-dark">
                            <span className="pcoded-micon"><i className="feather icon-user"></i></span>
                            <span>Miner Groups</span>
                        </NavLink>
                    </li>
                </ul>
                <ul className="pcoded-item pcoded-left-item">
                    <li className="">
                        <NavLink to="/wallet" className="waves-effect waves-dark">
                            <span className="pcoded-micon"><i className="fas fa-briefcase"></i></span>
                            <span>Wallet</span>
                        </NavLink>
                    </li>
                </ul>
                {/* <ul className="pcoded-item pcoded-left-item">
                    <li className="">
                        <NavLink to="/clients" className="waves-effect waves-dark">
                            <span className="pcoded-micon"><i className="feather icon-user"></i></span>
                            <span>Miner Clients</span>
                        </NavLink>
                    </li>
                </ul> */}
                <ul className="pcoded-item pcoded-left-item">
                    <li className="">
                        <NavLink to="/pool" className="waves-effect waves-dark">
                            <span className="pcoded-micon"><i className="feather icon-list"></i></span>
                            <span>Pool Status</span>
                        </NavLink>
                    </li>
                </ul>
                <ul className="pcoded-item pcoded-left-item">
                    <li className="">
                        <NavLink to="/crypto" className="waves-effect waves-dark">
                            <span className="pcoded-micon"><i className="feather icon-info"></i></span>
                            <span>Crypto Market</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

export default Menu;