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
              <li class="jsx-2008102337">
                <span class="jsx-2008102337">
                  {new Date(item.content_updated_at).toDateString()}
                </span>
                <a class="jsx-2008102337" href={`/blog/${item.slug}`}>
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
