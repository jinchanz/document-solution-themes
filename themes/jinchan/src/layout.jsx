import React from 'react';
import { join } from 'path';
import PropTypes from 'prop-types';
import { Nav, Divider, Shell, Box } from '@alifd/next';
import { Link } from 'react-router-dom';

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
      <>
        <main className="layout">
          <header>
            <Box  direction="row" justify="space-between" align="center">
              <a className="title" style={ { color: darkMode ? 'white' : 'black', textDecoration: 'none' } } href={path(`/${view}`)}>{title}</a>
              <Nav
                direction="hoz"
                hozAlign="right"
                type="line"
                activeDirection={null}          
                defaultSelectedKeys={this.props.defaultSelectedKeys}
                triggerType="hover"
              >
                <Item key="home"><Link id="homepage" to={path('/')}>博客</Link></Item>
                {/* <Item key="blog"><a href={path('/blog')}>博客</a></Item> */}
                <Item key="me"><Link id="me" to={path('/me')}>关于</Link></Item>
              </Nav>
            </Box>
          </header>
          <main className="content">
            { this.props.children }
          </main>
          {
            userInfo && userInfo.description && userInfo.description.beian && !this.props.defaultSelectedKeys.includes('blog')
            && <main className="footer"><Box>
                <Divider/>
                <Box direction={'row'} justify={'center'}>
                Ablula &copy;{new Date().getFullYear()} 版权所有 |&nbsp;<a target="_blank" href="https://beian.miit.gov.cn" >{userInfo.description.beian}</a>
                </Box>
              </Box>
            </main>
          }
        </main>
        </>
    );
  }
}
export default Container;
