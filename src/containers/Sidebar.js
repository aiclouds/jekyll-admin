import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { ADMIN_PREFIX } from '../constants';
import Splitter from '../components/Splitter';
import { fetchCollections } from '../ducks/collections';
import { capitalize } from '../utils/helpers';
import { sidebar as SidebarTranslations } from '../translations';
import classnames from 'classnames';
import _ from 'underscore';

export class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { collapsedPanel: true };
  }

  componentDidMount() {
    const { fetchCollections } = this.props;
    fetchCollections();
  }

  handleClick = () => {
    this.setState({
      collapsedPanel: !this.state.collapsedPanel,
    });
  };

  renderCollections(hiddens = []) {
    const { collections } = this.props;

    if (!collections.length) {
      return null;
    }

    const collectionItems = _.map(collections, (col, i) => {
      if (col.label != 'posts' && !hiddens.includes(col.label)) {
        return (
          <li key={i}>
            <Link
              activeClassName="active"
              to={`${ADMIN_PREFIX}/collections/${col.label}`}
            >
              <i className="fa fa-book" />
              {col.sidebar_label || capitalize(col.label)}
            </Link>
          </li>
        );
      }
    }).filter(Boolean);

    if (!collectionItems.length) {
      return null;
    }

    const { collapsedPanel } = this.state;
    const accordionClasses = classnames('accordion-label', {
      collapsed: collapsedPanel,
    });

    // Arbitrary manipulation based on visual cues from surrounding elements.
    // TODO: Compute values programmatically.
    const panelHeight = collapsedPanel ? 50 : (collectionItems.length + 1) * 50;

    return (
      <li className={accordionClasses} style={{ maxHeight: panelHeight }}>
        <a onClick={this.handleClick}>
          <i className="fa fa-book" />
          {SidebarTranslations.collections}
          <div className="counter">{collectionItems.length}</div>
          <div className="chevrons">
            <i className="fa fa-chevron-up" />
          </div>
        </a>
        <ul>{collectionItems}</ul>
      </li>
    );
  }

  render() {
    const { config } = this.props;

    const defaults = {
      pages: {
        icon: 'file-text',
        link: 'pages',
        translation: 'pages',
      },
      datafiles: {
        icon: 'database',
        link: 'datafiles',
        translation: 'datafiles',
        splitterBefore: true,
      },
      staticfiles: {
        icon: 'file',
        link: 'staticfiles',
        translation: 'staticfiles',
      },
      configuration: {
        icon: 'cog',
        link: 'configuration',
        translation: 'configuration',
        splitterBefore: true,
      },
    };

    const defaultLinks = _.keys(defaults);
    let hiddenLinks;

    try {
      hiddenLinks = config.jekyll_admin.hidden_links || [];
    } catch (e) {
      hiddenLinks = [];
    }

    const visibleLinks = _.difference(defaultLinks, hiddenLinks);

    const links = [];
    _.each(visibleLinks, (link, index, list) => {
      const current = defaults[link];
      if (current.splitterBefore) {
        links.push(<Splitter key={'splitter' + index} />);
      }
      links.push(
        <li key={index}>
          <Link activeClassName="active" to={`${ADMIN_PREFIX}/${current.link}`}>
            <i className={`fa fa-${current.icon}`} />
            {SidebarTranslations[current.translation]}
          </Link>
        </li>
      );
    });

    const collectionsPanel = this.renderCollections(hiddenLinks);
    const postsPanel = !hiddenLinks.includes('posts');
    const draftsPanel = config && config.show_drafts;

    return (
      <div className="sidebar">
        <Link className="logo" to={`${ADMIN_PREFIX}/pages`} />
        <ul className="routes">
          {collectionsPanel}
          {postsPanel && (
            <li>
              <Link
                activeClassName="active"
                to={`${ADMIN_PREFIX}/collections/posts`}
              >
                <i className="fa fa-book" />
                {SidebarTranslations.posts}
              </Link>
            </li>
          )}
          {draftsPanel && (
            <li>
              <Link activeClassName="active" to={`${ADMIN_PREFIX}/drafts`}>
                <i className="fa fa-edit" />
                {SidebarTranslations.drafts}
              </Link>
            </li>
          )}
          {(collectionsPanel || postsPanel || draftsPanel) && <Splitter />}
          {links}
        </ul>
      </div>
    );
  }
}

Sidebar.propTypes = {
  collections: PropTypes.array.isRequired,
  fetchCollections: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  collections: state.collections.collections,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchCollections,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
