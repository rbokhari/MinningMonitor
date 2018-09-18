import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

class NavItem extends Component {
  render () {
    const { router } = this.props;
    const { index, to, children, ...props } = this.props;
console.info('router', router);
    let isActive;
    if( router.isActive('/',true) && index ) isActive = true;
    else  isActive = router.isActive(to, true);
    
    const LinkComponent = index ? NavLink : NavLink;

    return (
      <li className={isActive ? 'active' : ''}>
        <LinkComponent to={to} {...props}>{children}</LinkComponent>
      </li>
    );
  }
}

NavItem = withRouter(NavItem)

export default NavItem