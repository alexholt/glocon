import ReactDOM from 'react-dom';
import React, {Component} from 'react';

class UI extends Component {
  render() {
    return (
      <aside className="ui__container">
        <div className="ui__block ui__block--top">
          <div
            className="ui__emblem ui__emblem--small"
            dangerouslySetInnerHTML={{
            __html: require('./images/emblems/usa.svg')
          }}/>
          <span className="ui__title">Phase 1 &mdash; Purchase Units</span>
        </div>
        <div className="ui__block ui__block--bottom">Hello</div>
      </aside>
    );
  }
}

function initialize() {
  ReactDOM.render(<UI/>, document.querySelector('#ui'));
}

module.exports = {
  initialize,
};
