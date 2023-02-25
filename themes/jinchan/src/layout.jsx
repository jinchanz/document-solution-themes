import React from 'react';
import { join } from 'path';
import PropTypes from 'prop-types';
import { Nav, Divider, Box } from '@alifd/next';
import { Link } from 'react-router-dom';

import './index.scss';

const path = p => join('', p);
const { Item } = Nav;

class Container extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    prefix: PropTypes.string,
  };

  static defaultProps = {
    data: {},
    prefix: '/',
  };

  // eslint-disable-next-line class-methods-use-this
  header(logo, view) {
    return (<Box justify="center" className="header-logo">
      <a href={path(`/${view}`)}>
        <img src={logo || '//img.alicdn.com/tfs/TB1pKookmzqK1RjSZFHXXb3CpXa-240-70.png'} alt="logo" />
      </a>
    </Box>);
  }

  render() {
    const { data, darkMode } = this.props;
    const { view, title, userInfo } = data;

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
                <Box direction="row" justify="center">
                Ablula &copy;{new Date().getFullYear()} 版权所有 |&nbsp;<a target="_blank" rel="noopener noreferrer" href="https://beian.miit.gov.cn" >{userInfo.description.beian}</a>
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
