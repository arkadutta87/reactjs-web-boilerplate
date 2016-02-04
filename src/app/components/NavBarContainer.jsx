import React from 'react';
import classnames from 'classnames';

const NavBarContainer = (props) =>
  (<div className={classnames('navbar-fixed', props.bottomNav ? 'bottom-nav' : 'top-nav', props.className)}>
      <nav>
          <div className="nav-wrapper">
              {props.children}
          </div>
      </nav>
  </div>);

NavBarContainer.propTypes = {
    bottomNav: React.PropTypes.bool,
    className: React.PropTypes.string
};

export default NavBarContainer;
