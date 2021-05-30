import React from 'react';
import { join } from 'path';
import PropTypes from 'prop-types';
import { keyBy, groupBy } from 'lodash';
import { Nav, Divider, Shell, Box } from '@alifd/next';
import DocumentSearch from './document-search/index';

const path = p => join('', p);
const { Item } = Nav;

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

  }

  header(logo, view) {

    return (<Box justify="center" className="header-logo">
      <a href={path(`/${view}`)}>
        <img src={logo || '//img.alicdn.com/tfs/TB1pKookmzqK1RjSZFHXXb3CpXa-240-70.png'} alt="logo" />
      </a>
    </Box>);
  }

  render() {
    const { data, showSearch, darkMode, prefix } = this.props;
    const { view, searchAPI, title, logo, onlyDoc, noHeader, userInfo } = data;

    return (
      <main>
        <header>
          <Box  direction="row" justify="space-between" align="center">
            <a className="title" style={ { color: darkMode ? 'white' : 'black', textDecoration: 'none' } } href={path(`/${view}`)}>{title}</a>
            <Nav
              direction="hoz"
              hozAlign="right"
              type="line"
              activeDirection={null}              
              selectedKeys={this.props.defaultSelectedKeys}
              triggerType="hover"
            >
              <Item key="home"><a id="homepage" href={path('/')}>首页</a></Item>
              <Item key="blog"><a href={path('/blog')}>博客</a></Item>
              <Item key="me"><a href={path('/me')}>关于</a></Item>
            </Nav>
          </Box>
        </header>
        <main className="content">
          { this.props.children }
          {
            userInfo && userInfo.description && userInfo.description.beian && !this.props.defaultSelectedKeys.includes('blog')
            && <Box className="footer">
              <Divider/>
              <Box direction={'row'} justify={'center'}>
              Ablula &copy;{new Date().getFullYear()} 版权所有 |&nbsp;<a target="_blank" href="http: beian.miit.gov.cn/" >{userInfo.description.beian}</a>
              </Box>
            </Box>
          }
        </main>
      </main>
      // <Shell style={{ marginTop: noHeader || onlyDoc ? -60 : 0, height: noHeader || onlyDoc ? 'calc(100vh + 60px)' : '100vh' }}>
      //   <Shell.Navigation
      //     direction="hoz"
      //     className="header"
      //     style={{ background: darkMode ? (data.blackColor || 'black') : (data.lightColor || '#ffffff00'), padding: '0 16px' }}>
      //       <Box  direction="row" className="header-simple" justify="space-between">
      //         <a style={ { color: darkMode ? 'white' : 'black', textDecoration: 'none' } } href={path(`/${view}`)}>{title}</a>
      //         <Nav
      //           direction="hoz"
      //           style={{ lineHeight: '55px' }}
      //           embeddable
      //           type={'123' ? 'normal' : 'primary'}
      //           activeDirection={'123' ? 'bottom' : null}
      //           hozAlign="right"
      //           selectedKeys={this.props.defaultSelectedKeys}
      //           triggerType="hover"
      //         >
      //           <Item key="home"><a id="homepage" href={path('/')}>首页</a></Item>
      //           <Item key="blog"><a href={path('/blog')}>博客</a></Item>
      //           <Item key="me"><a href={path('/me')}>关于</a></Item>
      //         </Nav>
      //       </Box>
      //   </Shell.Navigation>
      //   <Shell.Content>
      //     { this.props.children }
      //     {
      //       userInfo && userInfo.description && userInfo.description.beian && !this.props.defaultSelectedKeys.includes('blog')
      //       && <Box style={{ padding: '10px 0' }}>
      //         <Divider/>
      //         <Box direction={'row'} justify={'center'}>
      //         Ablula &copy;{new Date().getFullYear()} 版权所有 |  <a target="_blank" href="http://beian.miit.gov.cn/"
      //            style={{ color: 'black', textDecoration: 'none' }}>{userInfo.description.beian}</a>
      //         </Box>
      //       </Box>
      //     }
      //   </Shell.Content>
      // </Shell>
    );
  }
}
export default Container;
