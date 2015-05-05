/**
 * @jsx React.DOM
 */

var React = window.React || require('react');

/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */
var Token = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    onRemove: React.PropTypes.func,
    isPermanent: React.PropTypes.bool,
  },

  render: function() {
    var close;
    if (!this.props.isPermanent){
      close = this._makeCloseButton();
    }
    return (
      <div {...this.props} className={"typeahead-token " + this.props.class}>
        {this.props.name}
        {close}
      </div>
    );
  },

  _makeCloseButton: function() {
    if (!this.props.onRemove) {
      return "";
    }
    return (
      <a className="typeahead-token-close" href="#" onClick={function(event) {
          event.preventDefault();
          this.props.onRemove(this.props.name);
        }.bind(this)}>&#x00d7;</a>
    );
  }
});

module.exports = Token;
