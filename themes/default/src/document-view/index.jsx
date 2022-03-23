import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Loading, Message, Icon, Balloon } from '@alifd/next';

import './index.scss';
import Anchor from '@alifd/biz-anchor';

class DocumentView extends Component {
  static propTypes = {
    locator: PropTypes.string,
    tocClassName: PropTypes.string, // Table of Contents Class
    toc: PropTypes.object,
    api: PropTypes.string,
    doc: PropTypes.object,
    lazyLoad: PropTypes.bool,
    namespace: PropTypes.string,
    showEditor: PropTypes.bool,
  };

  static defaultProps = {
    api: '',
    locator: '',
    tocClassName: '',
    toc: {},
    doc: {},
    lazyLoad: false,
    showEditor: false,
  };

  constructor(props, context) {
    super(props, context);
    const state = {
      toc: {},
      loadingDocument: false,
      errorDocument: false,
    };
    if (!props.lazyLoad && props.document) {
      state.document = props.document;
    }

    this.state = state;
    this.content = null;
  }

  componentDidMount() {
    const { doc, lazyLoad, locator } = this.props;
    if (lazyLoad && locator) {
      this.fetchDocument(locator);
      return;
    }
    if (doc) {
      this.setState({
        doc,
      });
    }
  }

  componentWillReceiveProps(nextProps, props) {
    const { locator } = this.state;
    const { locator: newLocator, doc, lazyLoad } = nextProps;
    if (locator !== newLocator) {
      if (lazyLoad) {
        this.fetchDocument(newLocator);
      } else {
        this.setState({
          locator,
          doc,
        });
      }
    }
  }

  fetchDocument(locator) {
    if (!locator) {
      return;
    }
    const { api } = this.props;
    this.setState({
      loadingDocument: true,
      errorDocument: false,
      locator,
    });
    axios
      .get(`${api}/${locator}`)
      .then(({ data }) => {
        if (data) {
          this.setState({
            doc: data,
            loadingDocument: false,
            errorDocument: false,
          });
        } else {
          throw new Error(
            `There was a problem fetching document for locator: ${locator}`,
          );
        }
      })
      .catch((err) => {
        this.setState({
          loadingDocument: false,
          errorDocument: err,
        });
      });
  }

  render() {
    const { doc, loadingDocument, errorDocument, toc } = this.state;
    const { namespace, showEditor, baseUrl } = this.props;
    const yuqueBase = baseUrl && baseUrl.includes('api') && baseUrl.split('api')[0] || 'https:www.yuque.com/';
    return (
      <main className="wiki">
        {loadingDocument || !doc ? (
          <div className="help-loading">
            <Loading className="loading" />
          </div>
        ) : (
          <div>
            <h1 id="document-title" className="document__title">
              {doc.title}
              {showEditor && <Balloon trigger={<a rel="noopener noreferrer" target="_blank" href={`${yuqueBase}${namespace}/${doc.locator}`} style={{ marginLeft: 20, color: '#666666' }}><Icon size="small" type='edit'/></a>} closable={false}>
                  在语雀中编辑
              </Balloon>}
            </h1>
            <div className="document__main">
              <div
                id={`document-content-${doc.locator}`}
                className="document__content"
                dangerouslySetInnerHTML={{ __html: doc.data }}
              />
              {
                (toc.locator === doc.locator) && toc.doc
              }
            </div>
          </div>
        )}

        {errorDocument && (
          <Message title="Error" type="error">
            {errorDocument.message}
          </Message>
        )}
      </main>
    );
  }
}

export default DocumentView;
