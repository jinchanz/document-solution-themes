import React, { Component } from 'react';
import { List, Box, Button, Divider } from '@alifd/next';

import './index.scss';
class DocumentView extends Component {

  render() {
    const { posts } = this.props;
    return (
      <List style={{ minHeight: 'calc(100vh - 135px)'}}>
        { posts.map(item =>
          <List.Item style={{
            padding: '10px 20px'
          }} extra={
            <Box style={{height: '100%'}} justify={'flex-end'} direction={'column'}><Button component="a" type="primary" href={`/blog/${item.slug}`}>阅读全文</Button></Box>} key={item.id} title={item.title}>
            <p style={{margin: '12px 0'}}>{item.description}</p>
            <div>{new Date(item.content_updated_at).toLocaleString()}</div>
          </List.Item>
        ) }
      </List>
    );
  }
}

export default DocumentView;
