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

  _isSpecialTag: function(name) {
    if (name.indexOf("@") > -1) {
      return "mention ";
    }
    else if (name.indexOf("#") > -1) {
      return "hashtag ";
    }
    return "";
  },

  render: function() {
    var close;
    if (!this.props.isPermanent){
      close = this._makeCloseButton();
    }

    var className = "typeahead-token " + this._isSpecialTag(this.props.name) + this.props.name;
   
    return (
      <div {...this.props} className={className}>
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
