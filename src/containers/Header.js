import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export class Header extends Component {
  render() {
    const { config } = this.props;
    return (
      <div className="header">
        <h3 className="title">
          <Link target="_blank" to={config.url || '/'}>
            <i className="fa fa-home" />
            <span>{config.title || 'You have no title!'}</span>
          </Link>
        </h3>
        <span className="version">v{VERSION}</span>
      </div>
    );
  }
}

Header.propTypes = {
  config: PropTypes.object.isRequired,
};

export default Header;
