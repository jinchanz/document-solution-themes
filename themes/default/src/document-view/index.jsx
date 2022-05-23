import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Loading, Message, Icon, Balloon } from '@alifd/next';

import './index.scss';

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
    const { doc, lazyLoad, locator, loadingDocument, onRenderComplete } = this.props;
    const { doc: stateDoc } = this.state;
    if (!loadingDocument && stateDoc) {
      typeof onRenderComplete === 'function' && onRenderComplete();
    }
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

  componentDidUpdate() {
    const { loadingDocument, onRenderComplete } = this.props;
    const { doc: stateDoc } = this.state;
    if (!loadingDocument && stateDoc) {
      typeof onRenderComplete === 'function' && onRenderComplete();
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
    const { namespace, showEditor, baseUrl, contentMode, contentWidth, showMeta } = this.props;
    const yuqueBase = baseUrl && baseUrl.includes('api') && baseUrl.split('api')[0] || 'https:www.yuque.com/';
    let realContentWidth; const mainStyle = {};
    if (contentMode === 'fixWidth') {
      realContentWidth = contentWidth || 1080;
      mainStyle.maxWidth = realContentWidth;
    }
    return (
      <main className="wiki" style={mainStyle} >
        {loadingDocument || !doc ? (
          <div className="help-loading">
            <Loading className="loading" />
          </div>
        ) : (
          <div>
            <div id="document-title" className="document__title">
              <span>
                {doc.title}
              </span>
              <div className='editor'>
                {showEditor && <Balloon.Tooltip trigger={<a rel="noopener noreferrer" target="_blank" href={`${yuqueBase}${namespace}/${doc.locator}`} ><Icon size="small" type='edit'/></a>} closable={false}>
                  在语雀中编辑
              </Balloon.Tooltip>}
              </div>
            </div>
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
            {
              showMeta ? <div className='document-meta'>
                <div className="common" direction="row" spacing={10}>
                  <Balloon.Tooltip trigger={
                      <div className="common-item">
                        <Icon type="readquatity" size="small" />
                        <span>{doc.hits || 0}</span>
                      </div>
                    } 
                    closable={false}
                    align='t'
                    >
                    阅读量
                  </Balloon.Tooltip>
                  <Balloon.Tooltip trigger={
                      <div className="common-item">
                        <Icon type="text" size="small" />
                        <span>{doc.word_count}</span>
                      </div>
                    } 
                    closable={false}
                    align='t'
                    >
                    文章字数
                  </Balloon.Tooltip>
                </div>
                <div className='update-info'>
                  <strong>{doc.creator}</strong> 最后修改于 <strong>{new Date(doc.updated_at).toLocaleDateString()}</strong>
                </div>
              </div>
              : null
            }
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
