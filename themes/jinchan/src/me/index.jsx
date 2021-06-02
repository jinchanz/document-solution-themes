import React, { Component } from 'react';
import { Avatar, Box, Divider } from '@alifd/next';

import DocumentView from '../document-view/index';
import './index.scss';

class Me extends Component {


  render() {
    const { data, showSearch, lazyLoad, darkMode, prefix } = this.props;
    const { directories, api } = data || {};
    const aboutme = (directories || []).filter(document => document.locator === 'me');
    return aboutme && aboutme.length 
      ? <DocumentView lazyLoad={lazyLoad} api={api} locator={'me'} namespace={data.namespace} doc={aboutme[0].document} showEditor={data.showEditor} /> 
      : (
      <main className="me">
        <Box direction="row" align="center" justify="space-between">
          <h1>
            关于我
          </h1>
          <Avatar shape="square" src="https://i.ablula.tech/avatar.png" />
        </Box>
        <Divider className="divider" />
        我叫程科，花名金禅，目前就职于阿里巴巴，是集团前端委员会中后台物料生态负责人，集团低代码引擎共建小组核心成员。2018 年加入阿里巴巴业务平台事业部体验技术团队，目前专注于前端物料生态、低代码研发领域。
        <h1>
          关于本站
        </h1>
        <Divider />
        本站是基于我开发的 <strong>YuQueViewer</strong> 搭建的个人博客，博客内容通过语雀编写管理，通过阿里云 FaaS 实时从语雀拉取数据通过<a href="https://github.com/mark-ck/ablula-document-client" target="_blank">ablula-document-client</a>模板进行展示。
        <h1>
          团队招聘
        </h1>
        <Divider />
        我所在的团队是阿里巴巴业务平台事业部-体验技术团队，是一个拥有 100+ 前端工程师的大型前端团队，成长空间极佳。
        <br/>
        我们主要的产品有：
        <ul>
          <li>Fusion(中后台设计系统解决方案) </li>
          <li>Arms 前端监控系统</li>
          <li>集团中后台物料中心</li>
          <li>HpaPaaS 低代码研发平台</li>
          <li>Done 设计研发一体化平台</li>
        </ul>
        团队长期招募，感兴趣的同学<a href="mailto:mark.ck@alibaba-inc.com">欢迎与我联系</a>。
      </main>
    );
  }
}

export default Me;
