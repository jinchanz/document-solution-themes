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
            <Link to={`/blog/${item.slug}`}>
              <li key={item.title}>
                  {item.title}
                <time>
                  {moment(item.first_published_at || item.created_at).format('L')}
                </time>
              </li>
            </Link>
          ) 
        }
      </ul>
    </main>
  );
};

export default DocumentView;
