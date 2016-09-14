import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { fetchStoriesIfNeeded, selectSection, invalidateSection } from '../actions';


import Nav from '../components/Nav';
import Stories from '../components/Stories';
import StoriesPlaceholder from '../components/StoriesPlaceholder';


class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedSection } = this.props;
    dispatch(fetchStoriesIfNeeded(selectedSection));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSection !== this.props.selectedSection) {
      const { dispatch, selectedSection } = nextProps;
      dispatch(fetchStoriesIfNeeded(selectedSection));
    }
  }

  handleChange(nextSection) {
    const { dispatch } = this.props;
    dispatch(selectSection(nextSection));
  }

  handleRefresh(e) {
    e.preventDefault();
    const { dispatch, selectedSection } = this.props;
    dispatch(invalidateSection(selectedSection));
    dispatch(fetchStoriesIfNeeded(selectedSection));
  }

  render() {
    const { selectedSection, stories, isFetching } = this.props;
    const classes = cx({
      "App__Loader--loading": isFetching && stories.length === 0,
    }, "App__Loader");
    return (
      <div className="App">
        <Nav
          value={selectedSection}
          options={[
            'topstories',
            'newstories',
            'beststories'
          ]}
          onChange={this.handleChange}
          refresh={this.handleRefresh}
        >
          <div className={classes} />
        </Nav>
        {isFetching && stories.length === 0 &&
          <StoriesPlaceholder />
        }
        {stories.length > 0 &&
          <div className="Stories" style={{ opacity: isFetching ? 0.5 : 1}}>
            <Stories stories={stories} />
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { selectedSection, storiesBySection } = state;
  const {
    isFetching,
    items: stories
  } = storiesBySection[selectedSection] || {
    isFetching: true,
    items: []
  };
  return {
    selectedSection,
    stories,
    isFetching
  };
}

const AppContainer = connect(mapStateToProps)(App);

export default AppContainer;
