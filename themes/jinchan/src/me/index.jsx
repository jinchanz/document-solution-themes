import React, { Component } from 'react';
import { Avatar, Box, Divider } from '@alifd/next';

import './index.scss';

class DocumentView extends Component {


  render() {
    const { data, showSearch, lazyLoad, darkMode, prefix } = this.props;
    const { api, view, searchAPI, title, logo, onlyDoc, noHeader, userInfo } = data;
    return (
      <main className="me">
        <Box direction="row" align="center" justify="space-between">
          <h1>
            About Me
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
      </main>
    );
  }
}

export default DocumentView;
