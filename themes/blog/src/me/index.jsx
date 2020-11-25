import React, { Component } from 'react';

import './index.scss';

class DocumentView extends Component {


  render() {
    const { data, showSearch, lazyLoad, darkMode, prefix } = this.props;
    const { api, view, searchAPI, title, logo, onlyDoc, noHeader, userInfo } = data;
    return (
      <div className="wiki" style={{ minHeight: 'calc(100vh - 135px)' }}>
        {JSON.stringify(data.userInfo, null, 2)}
      </div>
    );
  }
}

export default DocumentView;
