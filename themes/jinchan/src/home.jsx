import React from 'react';
import PropTypes from 'prop-types';
import { keyBy } from 'lodash';
import { Message } from '@alifd/next';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import 'gitalk/dist/gitalk.css';
import GitalkComponent from "gitalk/dist/gitalk-component";

import Me from './me/index';
import Layout from './layout';
import Posts from './posts/index';
import Blog from './blog/index';
import Chat from './chat';

class Detail extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    prefix: PropTypes.string,
  };

  static defaultProps = {
    data: {
      gitalkConfig: {},
    },
    prefix: '/',
  };

  constructor(props, context) {
    super(props, context);
    const { data, prefix } = this.props;
    const { directories } = data;
    // eslint-disable-next-line no-underscore-dangle
    const _directories = directories.filter(document => document.locator !== 'me');
    const locator = props.match.params.name || (_directories && _directories[0] && _directories[0].locator);
    if (!locator) {
      location.href = `${prefix}${_directories[0].locator}`;
      return;
    }
    this.documents = keyBy(_directories, dir => dir.locator);
    this.state = {
      locator,
      directories: _directories,
      // eslint-disable-next-line react/no-unused-state
      loadingDirectories: false,
      errorDirectories: false,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getLocatorFromMatch(match) {
    return match && match.params && match.params.name;
  }

  // eslint-disable-next-line react/sort-comp
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

  render() {
    const {
      errorDirectories,
      locator,
    } = this.state;
    const { data, lazyLoad } = this.props;
    const { api, gitalkConfig } = data;
    const currentDocument = this.documents[locator].document;

    return (
      <main>
        {errorDirectories && (
          <Message title="Error" type="error">
            {errorDirectories.message}
          </Message>
        )}
        <Blog lazyLoad={lazyLoad} api={api} locator={locator} namespace={data.namespace} doc={currentDocument} showEditor={data.showEditor} />
        <GitalkComponent options={gitalkConfig} />
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
  } else if (href.includes('/chat')) {
    selectedKey = 'chat';
  }

  // const prefix = realData.view.slice(-1) === '/' ? realData.view : (`${realData.view  }/`);

  return (
    <BrowserRouter>
      <Layout prefix="/blog/" defaultSelectedKeys={[selectedKey]} lazyLoad={lazyLoad} showSearch={showSearch} data={realData} darkMode={!!data.data.darkMode}>
        <Switch>
          <Route exact path="/" render={(props =>
            <Posts {...props} posts={realData && realData.documents && realData.documents.filter(item => item.slug !== 'me') || []} />
          )}/>
          <Route path="/me" render={(props =>
              <Me {...props} data={realData} />
          )}/>
          <Route path="/chat" render={(() =>
              <Chat />
          )}/>
          <Route exact path="/*/:name" render={(props) =>
            <Detail {...props} prefix="/blog/" lazyLoad={lazyLoad} showSearch={showSearch} data={realData} darkMode={!!realData.darkMode} />}/>
          <Route path="/*/" render={(props) =>
            <Detail {...props} prefix="/blog/" lazyLoad={lazyLoad} showSearch={showSearch} data={realData} darkMode={!!realData.darkMode} />}>
            { directories && directories.length ? <Redirect to={`${'/blog/'}${directories[0].locator}`}/> : null}
          </Route>
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
