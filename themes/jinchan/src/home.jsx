import React from 'react';
import { join } from 'path';
import PropTypes from 'prop-types';
import { keyBy, groupBy } from 'lodash';
import { Nav, Message, Shell, Box } from '@alifd/next';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom';

import DocumentView from './document-view/index';
import Posts from './posts/index';
import Me from './me/index';
import Layout from './container';

const path = p => join('', p);
const { Item, SubNav } = Nav;

import './index.scss';

class Container extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    prefix: PropTypes.string,
  };

  static defaultProps = {
    data: {},
    prefix: '/',
  };
  constructor(props, context) {
    super(props, context);
    const { data, prefix } = this.props;
    const { directories } = data;
    const _directories = directories.filter(document => document.locator !== 'me');
    console.log('_directories in cons: ', _directories);
    const locator = props.match.params.name || (_directories && _directories[0] && _directories[0].locator);
    if (!locator) {
      location.href = `${prefix}${_directories[0].locator}`;
      return;
    }
    this.documents = keyBy(_directories, dir => dir.locator);
    this.state = {
      locator,
      directories: _directories,
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
    console.log('_directories in didmount: ', directories);
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
    const { prefix } = this.props;
    if (!documents || !documents.length) {
      return;
    }
    if (documents.length === 1) {
      return <Item key={documents[0].locator}>
        <Link to={`${prefix}${documents[0].locator}`}>{documents[0].name}</Link>
      </Item>;
    }

    return (
      <SubNav label={name} key={name}>
        {documents.map(doc => (
          <Item key={doc.locator}>
            <Link to={`${prefix}${doc.locator}`}>{doc.name}</Link>
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
    const { data, showSearch, lazyLoad, darkMode, prefix } = this.props;
    const { api, view, searchAPI, title, logo, onlyDoc, noHeader } = data;
    const { params } = this.props.match;
    const currentDocument = this.documents[locator].document;
    const selectedKeys = params && params.name ? [params.name] : [];

    return (
      <main>
        {errorDirectories && (
          <Message title="Error" type="error">
            {errorDirectories.message}
          </Message>
        )}
        <DocumentView lazyLoad={lazyLoad} api={api} locator={locator} namespace={data.namespace} doc={currentDocument} showEditor={data.showEditor} />
      </main>
    );
  }
}

const App = (data) => {
  const realData = data && data.data;
  const directories = realData && realData.directories.filter(document => document.locator !== 'me') || [];
  const showSearch = realData.showSearch && realData.searchAPI;
  let lazyLoad = realData.lazyLoad;
  if (!lazyLoad && directories.length > 20) {
    console.log(`Documents count > 20, auto change to lazyLoad mode`);
    lazyLoad = true;
  }
  let selectedKey = 'home';
  const href = location.pathname;
  if (href.includes('/blog')) {
    selectedKey = 'blog';
  } else if (href.includes('/me')) {
    selectedKey = 'me';
  }
  console.log('location: ', href);
  console.log('selectedKey: ', selectedKey);
  const prefix = realData.view.slice(-1) === '/' ? realData.view : (realData.view + '/');
  console.log('realData.view: ', realData.view);
  return (
    <BrowserRouter>
      <Layout prefix={'/blog/'} defaultSelectedKeys={selectedKey} lazyLoad={lazyLoad} showSearch={showSearch} data={realData} darkMode={!!data.data.darkMode}>
        <Switch>
          <Route exact path="/" render={(props =>
            <Posts {...props} posts={realData && realData.documents && realData.documents.filter(item => item.slug !== 'me') || []} />
          )}/>
          <Route path="/me" render={(props =>
              <Me {...props} data={realData} />
          )}/>
          <Route exact path={`/*/:name`} render={(props) =>
            <Container {...props} prefix={'/blog/'} lazyLoad={lazyLoad} showSearch={showSearch} data={realData} darkMode={!!realData.darkMode} />}/>
          <Route path={'/*/'} render={(props) =>
            <Container {...props} prefix={'/blog/'} lazyLoad={lazyLoad} showSearch={showSearch} data={realData} darkMode={!!realData.darkMode} />}>
            { directories && directories.length ? <Redirect to={`${'/blog/'}${directories[0].locator}`}/> : null}
          </Route>
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
