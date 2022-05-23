import React from 'react';
import { join } from 'path';
import { keyBy } from 'lodash';
import PropTypes from 'prop-types';
import { Nav, Message, Shell, Box, Icon, Button } from '@alifd/next';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';

import Anchor from './anchor/lib';
import DocShowNew from './document-view/index';
import DocumentSearch from './document-search/index';

import './index.scss';

const path = p => join('', p);
const { Item, SubNav } = Nav;

function getLocatorFromMatch(match) {
  return match && match.params && match.params.name;
}

function renderLogo(logo, homepage, logoHref, logoStyle) {
  const href = logoHref || homepage || '';
  return <Box justify="center" className="header-logo" style={logoStyle}>
    <a href={href.startsWith('http') ? href : path(`/${href}`)}>
      <img src={logo || '//img.alicdn.com/tfs/TB1pKookmzqK1RjSZFHXXb3CpXa-240-70.png'} alt="logo" />
    </a>
  </Box>;
}

function renderTitle(title, homepage, titleHref, darkMode) {
  const href = titleHref || homepage || '';
  return <Box justify="center" className="title">
  <a 
    style={ { color: darkMode ? 'white' : 'black', textDecoration: 'none' } } 
    href={href.startsWith('http') ? href : path(`/${href}`)}>
    <span className="header-title">{title}</span>
  </a>
</Box>;
}

class Container extends React.Component {
  static propTypes = {
    data: PropTypes.object,
  };

  static defaultProps = {
    data: {},
  };

  state = {
  };

  constructor(props, context) {
    super(props, context);
    const { data } = this.props;
    const { directories, view } = data;
    const locator = props.match.params.name || (directories && directories[0] && directories[0].locator);
    if (!locator) {
      location.href = `${view}/${directories[0].locator}`;
      return;
    }
    this.documents = keyBy(directories, dir => dir.locator);
    const defaultMQuery = {
      matches: window.innerWidth > 768 ? true : false,
    };
    this.state = {
      view,
      locator,
      directories,
      errorDirectories: false,
      showMobileNav: false,
      mQuery: defaultMQuery,
      ancillaryCollapse: !defaultMQuery.matches,
      leftNavCollapse: !defaultMQuery.matches,
    };
    this.leftNavRef = React.createRef();
    this.ancillaryRef = React.createRef();
    this.mediaQuery = window.matchMedia("(min-width: 768px)");
  }

  componentDidMount() {
    const { locator, directories } = this.state;
    const shellHeader = document.getElementsByClassName('next-shell-header')[0];
    const headerHeight = this.props.data.headerHeight;
    if (shellHeader) {
      shellHeader.style.height = typeof +headerHeight === 'number' ? `${headerHeight}px` : headerHeight;
    }
    if (!locator && directories && directories.length) {
      this.setState({
        locator: directories[0].locator,
      });
    }
    this.generateAnchor();
    document.addEventListener("mousedown", this.handleClickOutside);
    this.mediaQuery.addEventListener('change', this.handleMediaQueryChange);
  }

  componentWillReceiveProps(nextProps, props) {
    const locator = getLocatorFromMatch(props.match);
    const newLocator = getLocatorFromMatch(nextProps.match);

    if (locator !== newLocator) {
      this.setState({
        locator: newLocator,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { locator } = this.state;
    if (locator === prevState.locator) return;
    this.generateAnchor();
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    this.mediaQuery.removeEventListener("change", this.handleMediaQueryChange);
  }

  onDocumentRendered() {
    this.generateAnchor();
  }

  handleMediaQueryChange = (matches) => {
    this.setState({
      mQuery: matches,
      ancillaryCollapse: !matches.matches,
      leftNavCollapse: !matches.matches,
    });
  }

  handleClickOutside = (event) => {
    const leftNavRef = document.querySelector('.next-shell-localnavigation') || this.leftNavRef?.current;
    const ancillaryRef = document.querySelector('.next-aside-ancillary') || this.ancillaryRef?.current;
    const newState = {
      hasChange: false
    };
    if (leftNavRef && !leftNavRef.contains(event.target)) {
      if (!this.state.mQuery.matches) {
        newState.hasChange = true;
        newState.leftNavCollapse = true;
      }
    }
    if (ancillaryRef && !ancillaryRef.contains(event.target)) {
      if (!this.state.mQuery.matches) {
        newState.hasChange = true;
        newState.ancillaryCollapse = true;
      }
    }
    if (newState.hasChange) {
      delete newState.hasChange;
      this.setState(newState);
    }
  }

  toggleMobileNav = () => {
    const { showMobileNav } = this.state;
    this.setState({
      showMobileNav: !showMobileNav,
    });
  }

  toggleCollapse(position) {
    const key = `${position}Collapse`;
    const value = this.state[key];
    this.setState({
      [key]: !value,
    });
  }

  generateAnchor() {
    setTimeout(() => {
      const { locator, toc } = this.state;
      this.content = document.getElementById(`document-content-${locator}`);
      if (this.content && (!toc || (toc.locator !== locator))) {
        this.setState({
          toc: {
            doc: <Anchor style={{ marginTop: 20 }} content={() => this.content} />,
            locator,
          },
        });
        const { hash } = location;
        if (hash) {
          location.href = hash;
        }
      }
    });
  }

  render() {
    const {
      directories,
      errorDirectories,
      locator,
    } = this.state;
    const { data, showSearch, lazyLoad, darkMode } = this.props;
    const { showMobileNav, toc, leftNavCollapse, ancillaryCollapse, mQuery } = this.state;
    // FIXME: 兼容
    if (data.lightColor === '#ffffff00') {
      data.lightColor = 'white';
    }
    const {
      api, 
      view, 
      searchAPI, 
      hideLogo,
      hideTitle,
      title, 
      logo, 
      titleHref,
      logoHref,
      onlyDoc, 
      noHeader, 
      homepage, 
      searchPlaceholder, 
      menuDataSource, 
      headerHeight,
      menuStyle: originMenuStyle,
      logoStyle,
      contentMode = 'stretch',
      contentWidth = 1080,
    } = data;
    const { params } = this.props.match;
    if (!this.documents[locator]) {
      return <main style={{
        position: 'absolute',
        left: '45vw',
        top: '50vh',
      }}>
        文档 “{locator}” 不存在，点击<a href={view}>此处</a>返回首页
      </main>;
    }
    const currentDocument = this.documents[locator].document;
    const selectedKeys = params && params.name ? [params.name] : [];
    let menuStyle = {};
    if (originMenuStyle) {
      menuStyle = {
        ...originMenuStyle,
        color: (originMenuStyle.color || {})[darkMode ? 'dark' : 'light'],
      };
    }
    if (onlyDoc) {
      return <div className='document-container'>
          {errorDirectories && (
              <Message title="Error" type="error">
                  {errorDirectories.message}
              </Message>
          )}
          <DocShowNew lazyLoad={lazyLoad} api={api} locator={locator}
                      namespace={data.namespace} showEditor={data.showEditor} showMeta={data.showMeta}
                      doc={currentDocument} baseUrl={data.baseUrl}  onRenderComplete={this.onDocumentRendered.bind(this)}
                      />
      </div>;
    }

    let defaultNav = menuDataSource && menuDataSource[0] && menuDataSource[0].url;
    if (location.pathname && menuDataSource && menuDataSource.length) {
      const currentMenu = menuDataSource.find(item => {
        return !['', '/'].includes(item.url) && location.pathname.includes(item.url);
      });
      if (currentMenu) {
        defaultNav = currentMenu.url;
      }
    }

    return (
      <Shell style={{ height: '100vh' }} >
        {
          !noHeader ? <Shell.Navigation
            direction="hoz"
            className="header"
            style={{ 
              background: darkMode ? (data.blackColor || 'black') : (data.lightColor || 'white'),
              borderBottom: '1px solid #E6E7EB',
              height: headerHeight || 80,
            }}>
            <div className='header-container'>
              <Box direction='row' align='center'>
                  {/* { leftNavCollapse ? <Icon type="toggle-right" onClick={() => {
                    this.toggleCollapse('leftNav');
                  }} /> : null } */}
                <Box spacing={40} direction="row" align="center" style={{ height: '100%' }}>
                    {hideLogo ? null : renderLogo(logo, homepage, logoHref, logoStyle)}
                    {hideTitle ? null : renderTitle(title, homepage, titleHref, darkMode)}
                    {showSearch ? <Box justify="center" className='header-search' >
                      <DocumentSearch view={view} searchAPI={searchAPI} darkMode={darkMode} placeholder={searchPlaceholder} />
                    </Box> : null}
                </Box>
              </Box>
              {
                menuDataSource && menuDataSource.length ?
                <>
                  <div className="desktop-nav">
                    <Nav
                      mode="popup"
                      direction="hoz"
                      type="line"
                      defaultSelectedKeys={[defaultNav]}
                      triggerType="hover"
                    >
                      {
                        menuDataSource.map(item => {
                          return <Item className={darkMode ? 'dark-nav-item' : ''} key={item.url}>
                            <a href={item.url} target={item.target} >
                              <span style={menuStyle}> {item.label} </span>
                            </a>
                          </Item>;
                        })
                      }
                    </Nav>
                  </div>
                  { !showMobileNav ? 
                    <div className='mobile-nav-close'>
                      <Button iconSize="large" onClick={this.toggleMobileNav} ghost={ darkMode ? 'dark' : 'light' }><Icon type="list" /> </Button>
                    </div> :
                    <div className="mobile-nav-open">
                      <div className='mobile-nav-actions' style={{
                        height: headerHeight || 80,
                      }}>
                        <Button iconSize="large" onClick={this.toggleMobileNav} ghost={ darkMode ? 'dark' : 'light' }><Icon type="close" /> </Button>
                      </div>
                      <Nav
                        mode="popup"
                        defaultSelectedKeys={[menuDataSource[0].label]}
                        triggerType="hover"
                      >
                        {
                          menuDataSource.map(item => {
                            return <Item className={darkMode ? 'dark-nav-item' : ''} key={item.label}>
                              <a className='mobile-nav-item' href={item.url} target={item.target} >
                                <span style={menuStyle}> {item.label} </span>
                              </a>
                            </Item>;
                          })
                        }
                      </Nav>
                    </div>
                  }
                </> :
                null
              }
            </div>
          </Shell.Navigation> : null
        }
        <Shell.LocalNavigation collapse={leftNavCollapse} onCollapseChange={this.toggleCollapse.bind(this, 'leftNav')}>
          <div ref={this.leftNavRef}>
            <CustomNav selectedKeys={selectedKeys} directories={directories} view={this.state.view} isMobile={!mQuery.matches} toggleCollapse={this.toggleCollapse.bind(this)} />
            <Button type="normal" onClick={this.toggleCollapse.bind(this, 'leftNav')} className={`custom-nav-trigger${leftNavCollapse ? '-collapse' : ''}`} iconSize="large" >
              <Icon type={ leftNavCollapse ? "arrow-double-right" : "arrow-double-left" } />
            </Button>
          </div>
        </Shell.LocalNavigation>

        <Shell.Content>
          <div className='document-container' style={{marginTop: noHeader ? 0 : ((headerHeight || 80) - 72)}}>
            {errorDirectories && (
              <Message title="Error" type="error">
                {errorDirectories.message}
              </Message>
            )}
            <DocShowNew lazyLoad={lazyLoad} api={api} locator={locator}
                        namespace={data.namespace} showEditor={data.showEditor} 
                        doc={currentDocument} baseUrl={data.baseUrl} onRenderComplete={this.onDocumentRendered.bind(this)}
                        contentMode={contentMode} contentWidth={contentWidth} showMeta={data.showMeta}
                        />
          </div>
        </Shell.Content>
        <Shell.Ancillary collapse={ancillaryCollapse} onCollapseChange={this.toggleCollapse.bind(this, 'ancillary')}>
          <div ref={this.ancillaryRef} > { toc ? toc.doc : null } </div>
        </Shell.Ancillary>
      </Shell>
    );
  }
}

const CustomNav = withRouter((props) => {
  const { selectedKeys, directories, history, view, isMobile, toggleCollapse } = props;


  const onSelect = ([key]) => {
    if (isMobile) {
      toggleCollapse('leftNav');
    }
    if (key.match(/^http/)) {
      window.open(key);
    } else {
      history.push(key);
    }
    
  };

  const renderCategory = ({ name, locator, documents = [] }) => {
    if (!documents || !documents.length) {
      if (!locator) {
        return;
      }
      return <Item key={locator}>
        <Link to={`${view}/${locator}`}>{name}</Link>
      </Item>;
    }

    let key = locator;
    if (key === '#') {
      key = `${key} - ${name} - ${documents.length}`;
    }

    return (
      <SubNav label={name} key={key} selectable={locator && locator !=='#'}>
        {documents.map(doc => {
          if (doc.documents) {
            return renderCategory(doc);
          }
          return <Item key={doc.locator}>
            {
              (doc.locator.startsWith('http://') || doc.locator.startsWith('https://')) 
                ? <a target="_blank" href={doc.locator}>{doc.name}</a>
                : <Link to={`${view}/${doc.locator}`}>{doc.name}</Link>
            }
          </Item>
        })}
      </SubNav>
    );
  };

  const renderDirectories = (directories = []) => {
    let oldData = false;
    const depths = _.groupBy(directories.map(item => {
      if (!item.depth) {
        oldData = true;
        return {
          ...item,
          depth: item.name === item.category ? 1 : 2,
        };
      }
      return item;
    }), 'depth');
    let categories;
    if (oldData) {
      categories = directories.reduce((memo, dir) => {
        if (!memo.find(item => item.name === dir.category)) {
          if (dir.depth === 1) {
            memo.push({...dir});
          } else {
            memo.push({
              name: dir.category,
              uuid: dir.parent_uuid,
              document: dir.document,
              locator: dir.locator,
            });
          }
        }
        return memo;
      }, []);
    } else {
      categories = directories.reduce((memo, dir) => {
        const foundCategory = memo.find(item => (item.uuid === dir.parent_uuid));
        if (!dir.parent_uuid || !foundCategory) {
          if (dir.depth === 1) {
            memo.push({...dir});
          } else {
            memo.push({
              name: dir.category,
              uuid: dir.parent_uuid,
            });
          }
        }
        return memo;
      }, []);
    }
    
    depths[1] = categories;
    let formattedDirectories = [];
    for (let i = Object.keys(depths).length; i > 1; i--) {
      const currentDepth = depths[i - 1].map(item => {
        const subDocuments = [];
        depths[i].forEach(subDocument => {
          if (!item.uuid ? subDocument.category === item.name : subDocument.parent_uuid === item.uuid) {
            subDocuments.push(subDocument);
          }
        });
        return {
          ...item,
          documents: [...subDocuments],
        };
      });
      depths[i - 1] = currentDepth;
    }
    formattedDirectories = [ ...depths[1] ];
    const directoryElements = formattedDirectories.map(cat =>
      renderCategory(cat),
    ).filter(item => item);
    return directoryElements;
  };
  return <Nav embeddable className="help-nav" selectedKeys={selectedKeys} onSelect={ onSelect } aria-label="子菜单">
    {renderDirectories(directories)}
  </Nav>;
});

const App = (data) => {
  const realData = data && data.data;
  const directories = realData && realData.directories || [];
  const showSearch = realData.showSearch && realData.searchAPI;
  let lazyLoad = realData.lazyLoad;
  if (!lazyLoad && directories.length > 20) {
    console.log(`Documents count > 20, auto change to lazyLoad mode`);
    lazyLoad = true;
  }
  const firstDoc = directories.find(item => item && item.locator && item.locator !== '#');
  return (
    <Router>
      <div>
        <Route exact path={realData.view} render={(props) =>
          <Container {...props} lazyLoad={lazyLoad} showSearch={showSearch} data={data.data} darkMode={!!data.data.darkMode} />}>
          { directories && directories.length ? <Redirect from={realData.view} to={`${realData.view}/${firstDoc ? firstDoc.locator : ''}`}/> : null}
        </Route>
        <Route exact path={`${realData.view}/:name`} render={(props) =>
          <Container {...props} lazyLoad={lazyLoad} showSearch={showSearch} data={data.data} darkMode={!!data.data.darkMode} />}/>
      </div>
    </Router>
  );
};

export default App;
