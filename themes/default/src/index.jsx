import React from 'react';
import App from './home';
import mockData from './mock.json';

export default function DocumentThemeDefault() {
  return <App data={window.__INITIAL_STATE__ || mockData}/>;
}
