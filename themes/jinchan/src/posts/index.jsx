import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
                  {new Date(item.updated_at).toDateString()}
                </span>
                <Link to={`/blog/${item.slug}`}>
                  {item.title}
                </Link>
              </li>
            ) 
          }
        </ul>
      </main>
    );
  }
}

export default DocumentView;
