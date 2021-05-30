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

  fetchDocument(locator) {
    if (!locator) {
      return;
    }
    const { api } = this.props;
    this.setState({
      loadingDocument: true,
      errorDocument: false,
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
            `There was a problem fetching document for locator: ${locator}`
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

  componentDidMount() {
    const { doc, lazyLoad, locator } = this.props;
    if (lazyLoad && locator) {
      this.fetchDocument(locator);
      return;
    }
    if (doc) {
      this.setState({
        doc,
      })
    }
  }

  componentWillReceiveProps(nextProps, props) {
    const { locator } = props;
    const { locator: newLocator, doc, lazyLoad } = nextProps;

    if (locator !== newLocator) {
      if (lazyLoad) {
        this.fetchDocument(newLocator);
      } else {
        this.setState({
          locator,
          doc,
        })
      }
    }
  }

  render() {
    const { doc, loadingDocument, errorDocument, toc } = this.state;
    const { namespace, showEditor } = this.props;
    // setTimeout(() => {
    //   if (!doc) return;
    //   if (!toc.doc || (toc.locator !== doc.locator)) this.content = document.getElementById(`document-content-${doc.locator}`);
    //   if (this.content && (!toc || (toc.locator !== doc.locator))) this.setState({
    //     toc: {
    //       doc: <div style={{ position: 'fixed', top: 80, right: 50 }}>
    //         <Anchor style={{ width: 180 }} noHash content={() => this.content} />
    //       </div>,
    //       locator: doc.locator
    //     }
    //   });
    // });

    return (
      <main className="article">
        {loadingDocument || !doc ? (
          <div className="help-loading">
            <Loading className="loading" />
          </div>
        ) : (
          <div>
            <h1 id="document-title" className="document__title">
              {doc.title}
              {showEditor && <Balloon trigger={<a target="_blank" href={`https:www.yuque.com/${namespace}/${doc.locator}`} style={{ marginLeft: 20, color: '#666666' }}><Icon size={'small'} type='edit'/></a>} closable={false}>
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
