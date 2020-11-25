import React from 'react';
import { Nav } from '@alifd/next';

import './index.scss';

const { Item } = Nav;

const docScrollTo = (id) => {
  const elem = document.getElementById(id);
  if (elem) {
    elem.scrollIntoView();
  }
};

const renderDocTocItem = (id, title) => (
  <Item key={id} onClick={() => docScrollTo(id)} >
    <span dangerouslySetInnerHTML={{ __html: title }} />
  </Item>
);

const renderDocToc = (content) => {
  if (!content) {
    return null;
  }
  const items = [];

  const dom = document.createElement('div');
  dom.innerHTML = content;
  let headers = dom.querySelectorAll('h2');
  if (!headers.length) {
    headers = dom.querySelectorAll('h3');
  }

  if (headers.length) {
    headers.forEach((header) => {
      if (header.textContent) {
        items.push(renderDocTocItem(header.id, header.textContent));
      }
    });
    return <Nav className="document__toc">{items}</Nav>;
  }

  return null;
};

const DocumentView = ({ content }) => renderDocToc(content);

export default DocumentView;
