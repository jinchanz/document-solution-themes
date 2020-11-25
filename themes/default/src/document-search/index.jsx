import React from 'react';
import axios from 'axios';
import { groupBy, debounce } from 'lodash';
import { findAll } from 'highlight-words-core';
import { Search, Overlay, Grid, Menu, Loading, Message } from '@alifd/next';

import './index.scss';

const { Row, Col } = Grid;
const { Item: MenuItem, Group: MenuGroup } = Menu;

class DocumentSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = debounce(this.handleSearch.bind(this), 500);
    this.handleFocus = this.handleFocus.bind(this);

    this.state = {
      showResults: false,
      searchResults: {},
      loading: false,
    };
  }

  parseResults = (resultsList = []) => {
    let results = {};
    if (resultsList && resultsList.length) {
      results = groupBy(resultsList, 'category');
    }
    return results;
  };

  handleSearch(searchString = '') {
    const { searchAPI } = this.props;
    if (!searchString || searchString.length < 2) {
      return;
    }
    this.setState({
      loading: true,
      error: false,
    });

    axios
      .get(searchAPI, {
        params: {
          keywords: searchString,
        },
      })
      .then(({ data }) => {
        const results = (data && data.data && data.data) || [];

        if (data) {
          this.setState({
            searchString,
            searchTerms: data.segments,
            searchResults: this.parseResults(results),
            showResults: true,
            loading: false,
          });
        } else {
          this.setState({
            searchString,
            loading: false,
            error: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          searchString,
          loading: false,
          error: true,
        });
      });
  }

  handleResultsClose = () => {
    this.setState({
      showResults: false,
      error: false,
      loading: false,
    });
  };

  handleResultClick = (groupId, locator) => {
    const { view } = this.props;
    window.location.href = `${view}#/${locator}`;
    this.setState({
      showResults: false,
    });
  };

  handleFocus = () => {
    const { searchResults } = this.state;
    if (searchResults && Object.keys(searchResults).length) {
      this.setState({
        showResults: true,
      });
    }
  }

  markupSearchKeyword = (text, key) => (
    <span key={key} className="help-search-result__keyword">
      {text}
    </span>
  );

  highlightText = (content = '', searchWords = []) => {
    content = content.replace('<em>', '');
    content = content.replace('</em>', '');
    const chunks = findAll({
      searchWords,
      textToHighlight: content,
    });

    const displayChunks = chunks.slice(chunks.find(chunk => chunk.highlight));

    const displayText = displayChunks.map((chunk) => {
      const { start, end, highlight } = chunk;
      const text = content.substr(start, end - start);

      return highlight
        ? this.markupSearchKeyword(text, `highlight-${text}-${start}`)
        : text;
    });

    if (chunks.length && displayText.length > 1 && !chunks[0].highlight) {
      const match = displayText[0].match(/[^\s]{0,8}[^\w]?$/);
      displayText[0] = (match && match[0]) || '';
    }

    return (displayText.length && displayText) || content;
  };

  renderResultsRow = (
    { title, content, locator, groupId },
    index,
    searchTerms,
  ) => (
    <MenuItem
      key={`${title}-${index}`}
      title={title}
      onClick={() => this.handleResultClick(groupId, locator)}
    >
      <Row className="help-search-row">
        <Col span="8" className="help-search-row__title">
          {this.highlightText(title, searchTerms)}
        </Col>
        <Col span="16" className="help-search-row__content">
          {this.highlightText(content, searchTerms)}
        </Col>
      </Row>
    </MenuItem>
  );

  renderResultsCategory = (title, results, searchTerms) => (
    <MenuGroup label={title} key={title}>
      {results.map((r, i) => this.renderResultsRow(r, i, searchTerms))}
    </MenuGroup>
  );

  renderSearchOverlayInner = (searchResults, loading, searchString, searchTerms, error) => {
    const categories = Object.keys(searchResults).sort();
    let menuInner;

    if (error) {
      menuInner = (
        <Message title="错误" type="error">
          {' '}
          抱歉，搜索 “{searchString}” 时出错{' '}
        </Message>
      );
    } else if (loading) {
      menuInner = (
        <div>
          <Loading className="help-search__loading" />
        </div>
      );
    } else if (categories.length) {
      menuInner = categories.map(name =>
        this.renderResultsCategory(name, searchResults[name], searchTerms),
      );
    } else {
      menuInner = (
        <Message type="notice"> 未找到查询 “{searchString}” 的结果</Message>
      );
    }

    return (
      <Menu
        className={
          loading || categories.length
            ? 'help-search__inner'
            : 'help-search__inner--error'
        }
      >
        {menuInner}
      </Menu>
    );
  };

  render() {
    const {
      showResults,
      searchResults,
      loading,
      searchString,
      searchTerms,
      error,
    } = this.state;
    const { darkMode, placeholder } = this.props;
    const searchType = !darkMode ? 'normal' : 'dark';
    return (
      <div>
        <Search
          type={searchType}
          placeholder={placeholder || '请输入关键词'}
          shape="simple"
          className="help-search__input"
          onSearch={() => this.handleSearch.flush()}
          onChange={this.handleSearch}
          onFocus={this.handleFocus}
          ref={ref => (this.searchRef = ref)}
        />
        <Overlay
          visible={showResults || loading || error}
          safeNode={() => this.searchRef}
          target={() => this.searchRef}
          onRequestClose={this.handleResultsClose}
        >
          {showResults || loading || error
            ? this.renderSearchOverlayInner(
              searchResults,
              loading,
              searchString,
              searchTerms,
              error,
            )
            : null}
        </Overlay>
      </div>
    );
  }
}

export default DocumentSearch;
