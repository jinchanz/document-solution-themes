import React from 'react';
import { join } from 'path';
import PropTypes from 'prop-types';
import { keyBy, groupBy } from 'lodash';
import { Nav, Message, Shell, Box } from '@alifd/next';
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom';

import DocumentSearch from './document-search/index';
import DocShowNew from './document-view/index';

import './index.scss';

const path = p => join('', p);
const { Item, SubNav } = Nav;

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
    const { directories, view } = data;
    const locator = props.match.params.name || (directories && directories[0] && directories[0].locator);
    if (!locator) {
      location.href = `${view}/${directories[0].locator}`;
      return;
    }
    this.documents = keyBy(directories, dir => dir.locator);
    this.state = {
      view,
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
    const { api, view, searchAPI, title, logo, onlyDoc, noHeader, homepage, searchPlaceholder } = data;
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
    if (onlyDoc) {
      return <div style={{ background: '#fff', height: 'calc(100vh - 60px)', paddingRight: '230px'}}>
          {errorDirectories && (
              <Message title="Error" type="error">
                  {errorDirectories.message}
              </Message>
          )}
          <DocShowNew lazyLoad={lazyLoad} api={api} locator={locator}
                      namespace={data.namespace} showEditor={data.showEditor} doc={currentDocument} baseUrl={data.baseUrl} />
      </div>;
    }

    return (
      <Shell style={{ marginTop: noHeader ? -60 : 0, height: noHeader ? 'calc(100vh + 60px)' : '100vh' }}>
        <Shell.Navigation
          direction="hoz"
          className="header"
          style={{ background: darkMode ? (data.blackColor || 'black') : (data.lightColor || '#ffffff00') }}>
            <Box spacing={40} direction="row" align="center" className="header-simple" width="1200px" style={{
              margin: '0 auto',
            }}>
                {this.header(logo, homepage)}
                <Box justify="center" className="title">
                  <a style={ { color: darkMode ? 'white' : 'black', textDecoration: 'none' } } href={path(`/${view}`)}><span className="header-title">{title}</span></a>
                </Box>
                {showSearch ? <Box justify="center" >
                  <DocumentSearch view={view} searchAPI={searchAPI} darkMode={darkMode} placeholder={searchPlaceholder} />
                </Box> : null}
            </Box>
        </Shell.Navigation>
        <Shell.LocalNavigation>
          <CustomNav selectedKeys={selectedKeys} directories={directories} view={this.state.view} />
        </Shell.LocalNavigation>

        <Shell.Content>
          <div style={{ background: '#fff', paddingRight: '230px'}}>
            {errorDirectories && (
              <Message title="Error" type="error">
                {errorDirectories.message}
              </Message>
            )}
            <DocShowNew lazyLoad={lazyLoad} api={api} locator={locator}
                        namespace={data.namespace} showEditor={data.showEditor} doc={currentDocument} baseUrl={data.baseUrl} />
          </div>
        </Shell.Content>
      </Shell>
    );
  }
}

const CustomNav = withRouter((props) => {
  const { selectedKeys, directories, history, view } = props;


  const onSelect = ([key]) => {
    if (key.match(/^http/)) {
      window.open(key);
    } else {
      history.push(key);
    }
  }

  const renderCategory = ({ name, locator, documents = [] }) => {
    if (!documents || !documents.length) {
      if (!locator) {
        return;
      }
      return <Item key={locator}>
        <Link to={`${view}/${locator}`}>{name}</Link>
      </Item>;
    }

    return (
      <SubNav label={name} key={locator || name} selectable={locator}>
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
  }

  const renderDirectories = (directories = []) => {
    const depths = _.groupBy(directories, 'depth');
    const categories = directories.reduce((memo, dir) => {
      if (!dir.parent_uuid || !memo.find(item => item.uuid === dir.parent_uuid)) {
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
    
    depths[1] = categories;
    let formattedDirectories = [];
    for (let i = Object.keys(depths).length; i > 1; i--) {
      const currentDepth = depths[i - 1].map(item => {
        const subDocuments = [];
        depths[i].forEach(subDocument => {
          if (subDocument.parent_uuid === item.uuid) {
            subDocuments.push(subDocument);
          }
        });
        return {
          ...item,
          documents: [...subDocuments]
        };
      });
      depths[i - 1] = currentDepth;
    }
    formattedDirectories = [ ...depths[1] ];

    const directoryElements = formattedDirectories.map(cat =>
      renderCategory(cat),
    );
    return directoryElements;
  }
  return <Nav embeddable className="help-nav" selectedKeys={selectedKeys} onSelect={ onSelect } aria-label="子菜单">
    {renderDirectories(directories)}
  </Nav>
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
  return (
    <Router>
      <div>
        <Route exact path={realData.view} render={(props) =>
          <Container {...props} lazyLoad={lazyLoad} showSearch={showSearch} data={data.data} darkMode={!!data.data.darkMode} />}>
          { directories && directories.length ? <Redirect from={realData.view} to={`${realData.view}/${directories[0].locator}`}/> : null}
        </Route>
        <Route exact path={`${realData.view}/:name`} render={(props) =>
          <Container {...props} lazyLoad={lazyLoad} showSearch={showSearch} data={data.data} darkMode={!!data.data.darkMode} />}/>
      </div>
    </Router>
  );
};

export default App;
