import React, { Component } from 'react';
import { List, Box, Button, Divider } from '@alifd/next';

import './index.scss';
class DocumentView extends Component {

  render() {
    const { posts } = this.props;
    return (
      <main className="home">
        <ul>
          { posts.map(item =>
              <li key={item.title}>
                <span>
                  {new Date(item.content_updated_at).toDateString()}
                </span>
                <a href={`/blog/${item.slug}`}>
                  {item.title}
                </a>
              </li>
            ) 
          }
        </ul>
      </main>
    );
  }
}

export default DocumentView;
