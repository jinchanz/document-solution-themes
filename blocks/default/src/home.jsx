import React from 'react';
import { join } from 'path';
import PropTypes from 'prop-types';
import { keyBy, groupBy } from 'lodash';
import { Nav, Message, Shell, Box } from '@alifd/next';
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom';

import DocumentSearch from './document-search/index';
import DocShowNew from './document-view/index';

const path = p => join('', p);
const { Item, SubNav } = Nav;

import './index.scss';

class Container extends React.Component {
  static propTypes = {
    data: PropTypes.object,
  };

  static defaultProps = {
    data: {},
  };
  constructor(props, context) {
    super(props, context);
    const { data } = this.props;
    const { directories } = data;
    const locator = props.match.params.name || (directories && directories[0] && directories[0].locator);
    if (!locator) {
      location.hash = `#/${directories[0].locator}`;
      return;
    }
    this.documents = keyBy(directories, dir => dir.locator);
    this.state = {
      locator,
      directories,
      loadingDirectories: false,
      errorDirectories: false,
    };
  }

  processDirectories(directories = []) {
    const categoryOrder = directories.reduce((memo, dir) => {
      if (!memo.includes(dir.category)) {
        memo.push(dir.category);
      }
      return memo;
    }, []);

    return {
      categoryMap: groupBy(directories, dir => dir.category),
      categoryOrder,
    };
  }

  getLocatorFromMatch(match) {
    return match && match.params && match.params.name;
  }

  componentWillReceiveProps(nextProps, props) {
    const locator = this.getLocatorFromMatch(props.match);
    const newLocator = this.getLocatorFromMatch(nextProps.match);

    if (locator !== newLocator) {
      this.setState({
        locator: newLocator,
      });
    }
  }

  componentDidMount() {
    const { locator, directories } = this.state;
    if (!locator && directories && directories.length) {
      this.setState({
        locator: directories[0].locator,
      });
    }
  }

  insertDividers(directoryElements) {
    return directoryElements.reduce((memo, next, index, src) => {
      memo.push(next);
      if (index !== src.length - 1) {
        // eslint-disable-next-line react/no-array-index-key
        // memo.push(<Divider key={`divider ${index}`} />);
      }
      return memo;
    }, []);
  }

  renderCategory(name, documents = []) {

    if (!documents || !documents.length) {
      return;
    }
    if (documents.length === 1) {
      return <Item key={documents[0].locator}>
        <Link to={`/${documents[0].locator}`}>{documents[0].name}</Link>
      </Item>;
    }

    return (
      <SubNav label={name} key={name}>
        {documents.map(doc => (
          <Item key={doc.locator}>
            <Link to={`/${doc.locator}`}>{doc.name}</Link>
          </Item>
        ))}
      </SubNav>
    );
  }

  renderDirectories(directories = []) {
    const { categoryMap, categoryOrder } = this.processDirectories(directories);
    const directoryElements = categoryOrder.map(cat =>
      this.renderCategory(cat, categoryMap[cat])
    );
    return this.insertDividers(directoryElements);
  }

  header(logo, view) {

    return (<Box justify="center" className="header-logo">
      <a href={path(`/${view}`)}>
        <img src={logo || '//img.alicdn.com/tfs/TB1pKookmzqK1RjSZFHXXb3CpXa-240-70.png'} alt="logo" />
      </a>
    </Box>);
  }

  render() {
    const {
      directories,
      errorDirectories,
      locator,
    } = this.state;
    const { data, showSearch, lazyLoad, darkMode } = this.props;
    const { api, view, searchAPI, title, logo, onlyDoc, noHeader } = data;
    const { params } = this.props.match;
    const currentDocument = this.documents[locator].document;
    const selectedKeys = params && params.name ? [params.name] : [];
    if (onlyDoc) {
      return <div style={{ background: '#fff', height: 'calc(100vh - 60px)', paddingRight: '230px'}}>
          {errorDirectories && (
              <Message title="Error" type="error">
                  {errorDirectories.message}
              </Message>
          )}
          <DocShowNew lazyLoad={lazyLoad} api={api} locator={locator}
                      namespace={data.namespace} showEditor={data.showEditor} doc={currentDocument} />
      </div>;
    }

    return (
      <Shell style={{ marginTop: noHeader ? -60 : 0, height: noHeader ? 'calc(100vh + 60px)' : '100vh' }}>
        <Shell.Navigation
          direction="hoz"
          className="header"
          style={{ background: darkMode ? (data.blackColor || 'black') : (data.lightColor || '#ffffff00'), padding: '0 16px' }}>
            <Box spacing={70} direction="row" align="center" className="header-simple" width={'1200px'} style={{
              margin: '0 auto'
            }}>
                {this.header(logo, view)}
                <Box justify="center" className="title">
                    <a style={ { color: darkMode ? 'white' : 'black', textDecoration: 'none' } } href={path(`/${view}`)}>{title}</a>
                </Box>
                {showSearch ? <Box justify="center" >
                  <DocumentSearch view={view} searchAPI={searchAPI} darkMode={darkMode} />
                </Box> : null}
            </Box>
        </Shell.Navigation>
        <Shell.LocalNavigation>
          <Nav embeddable className="help-nav" selectedKeys={selectedKeys} aria-label="子菜单">
            {this.renderDirectories(directories)}
          </Nav>
        </Shell.LocalNavigation>

        <Shell.Content>
          <div style={{ background: '#fff', height: 'calc(100vh - 60px)', paddingRight: '230px'}}>
            {errorDirectories && (
              <Message title="Error" type="error">
                {errorDirectories.message}
              </Message>
            )}
            <DocShowNew lazyLoad={lazyLoad} api={api} locator={locator} namespace={data.namespace} doc={currentDocument} showEditor={data.showEditor} />
          </div>
        </Shell.Content>
      </Shell>
    );
  }
}

const App = (data) => {
  const realData = data && data.data;
  const directories = realData && realData.directories || [];
  const showSearch = realData.showSearch && realData.searchAPI;
  let lazyLoad = realData.lazyLoad;
  if (!lazyLoad && directories.length > 20) {
    console.log(`Documents count > 20, auto change to lazyLoad mode`);
    lazyLoad = true;
  }
  return (
    <Router>
      <div>
        <Route exact path="/" render={(props) =>
          <Container {...props} lazyLoad={lazyLoad} showSearch={showSearch} data={data.data} darkMode={!!data.data.darkMode} />}>
          { directories && directories.length ? <Redirect from="/" to={`${directories[0].locator}`}/> : null}
        </Route>
        <Route exact path="/:name" render={(props) =>
          <Container {...props} lazyLoad={lazyLoad} showSearch={showSearch} data={data.data} darkMode={!!data.data.darkMode} />}/>
      </div>
    </Router>
  );
};

export default App;
