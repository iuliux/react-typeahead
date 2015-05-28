/**
 * @jsx React.DOM
 */

var React = require('react');
var classNames = require('classnames');

/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */
var Token = React.createClass({displayName: "Token",
  propTypes: {
    name: React.PropTypes.string,
    isPermanent: React.PropTypes.bool,
    className: React.PropTypes.string,
    children: React.PropTypes.string,
    onRemove: React.PropTypes.func
  },

  render: function() {
    var close;
    if (!this.props.isPermanent){
      close = this._renderCloseButton()
    }

    var className = classNames(
      "typeahead-token",
      this._isSpecialTag(this.props.name),
      this.props.class, // TODO: get rid this.props.class... should be className
      this.props.className
    );

    return (
      React.createElement("div", {className: className}, 
        this._renderHiddenInput(), 
        this.props.name, 
        close
      )
    );
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

  _renderHiddenInput: function() {
    // If no name was set, don't create a hidden input
    if (!this.props.name) {
      return null;
    }

    return (
      React.createElement("input", {
        type: "hidden", 
        name:  this.props.name + '[]', 
        value:  this.props.children}
      )
    );
  },

  _renderCloseButton: function() {
    if (!this.props.onRemove) {
      return "";
    }
    return (
      React.createElement("a", {className: "typeahead-token-close", href: "#", onClick: function(event) {
        event.preventDefault();
        this.props.onRemove(this.props.name);
      }.bind(this)}, "×")
    );
  }

});

module.exports = Token;
