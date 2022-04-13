import moment from 'moment';
import { Link } from 'react-router-dom';
import * as React from 'react';
import './index.scss';

moment.locale('zh-cn');
const DocumentView = (props) => {
  const { posts } = props;
  return (
    <main className="home">
      <ul>
        { posts.map(item =>
            <li key={item.title}>
              <Link to={`/blog/${item.slug}`}>
                {item.title}
              </Link>
              <time>
                {moment(item.first_published_at).fromNow()}
              </time>
            </li>,
          ) 
        }
      </ul>
    </main>
  );
};

export default DocumentView;
