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
    isSuggested: React.PropTypes.bool,
    className: React.PropTypes.string,
    children: React.PropTypes.string,
    onRemove: React.PropTypes.func,
    onApprove: React.PropTypes.func,
    onDisapprove: React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      onApprove: function() {},
      onDisapprove: function() {},
    };
  },

  render: function() {
    var actions;
    if (!this.props.isPermanent && !this.props.isSuggested){
      actions = this._renderCloseButton();
    } else if (this.props.isSuggested) {
      actions = this._renderSuggestedConfirmation();
    }

    var className = classNames(
      "typeahead-token",
      this._isSpecialTag(this.props.name),
      this.props.className
    );

    return (
      React.createElement("div", {className: className}, 
        this._renderHiddenInput(), 
        this._renderTagTypeIcon(), " ", '\u00A0', 
        this.props.name, 
        actions
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

  _renderTagTypeIcon: function() {
    var icon;
    if (this.props.className == 'S') {
      icon = (
        React.createElement("i", {className: "fa fa-lightbulb-o tagtype-icon"})
      );
    } else if (this.props.className == 'K') {
      icon = (
        React.createElement("i", {className: "fa fa-bookmark-o tagtype-icon"})
      );
    }
    return icon;
  },

  _renderSuggestedConfirmation: function() {
    return (
      React.createElement("span", {className: "typeahead-token-controls"}, 
        React.createElement("a", {className: "typeahead-token-check", href: "#", onClick: function(event) {
            event.preventDefault();
            this.props.onApprove(this.props.name);
          }.bind(this)}, React.createElement("i", {className: "fa fa-check"})), 
        React.createElement("a", {className: "typeahead-token-close", href: "#", onClick: function(event) {
            event.preventDefault();
            this.props.onDisapprove(this.props.name);
          }.bind(this)}, React.createElement("i", {className: "fa fa-times"}))
      )
    );
  },

  _renderCloseButton: function() {
    if (!this.props.onRemove) {
      return "";
    }
    return (
      React.createElement("span", {className: "typeahead-token-controls"}, 
        React.createElement("a", {className: "typeahead-token-close", href: "#", onClick: function(event) {
          event.preventDefault();
          this.props.onRemove(this.props.name);
        }.bind(this)}, React.createElement("i", {className: "fa fa-times"}))
      )
    );
  }

});

module.exports = Token;
