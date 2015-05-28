/**
 * @jsx React.DOM
 */

var React = require('react');
var Token = require('./token');
var KeyEvent = require('../keyevent');
var Typeahead = require('../typeahead');
var classNames = require('classnames');

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */
var TypeaheadTokenizer = React.createClass({displayName: "TypeaheadTokenizer",
  propTypes: {
    name: React.PropTypes.string,
    options: React.PropTypes.array,
    customClasses: React.PropTypes.object,
    allowCustomValues: React.PropTypes.number,
    defaultSelected: React.PropTypes.array,
    defaultValue: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    inputProps: React.PropTypes.object,
    onTokenRemove: React.PropTypes.func,
    onTokenAdd: React.PropTypes.func,
    onDuplicateAdd: React.PropTypes.func,
    filterOption: React.PropTypes.func,
    maxVisible: React.PropTypes.number
  },

  getInitialState: function() {
    return {
      // We need to copy this to avoid incorrect sharing
      // of state across instances (e.g., via getDefaultProps())
      selected: this.props.defaultSelected.slice(0)
    };
  },

  getDefaultProps: function() {
    return {
      options: [],
      defaultSelected: [],
      customClasses: {},
      allowCustomValues: 0,
      defaultValue: "",
      placeholder: "",
      inputProps: {},
      onTokenAdd: function() {},
      onTokenRemove: function() {},
      onDuplicateAdd: function() {},
    };
  },

  // TODO: Support initialized tokens
  //
  _renderTokens: function() {
    var tokenClasses = {};
    tokenClasses[this.props.customClasses.token] = !!this.props.customClasses.token;
    var classList = classNames(tokenClasses);
    //add normal tokens
    var result = this.state.selected.map(function(selected, idx) {
      return (
        React.createElement(Token, {
        key:  idx, 
        className: classList, 
        class: selected.class, 
        onRemove:  this._removeTokenForValue, 
        isPermanent: selected.perm, 
        name: selected.name})
      )
    }, this);
    return result;
  },

  _getOptionsForTypeahead: function() {
    // return this.props.options without this.selected
    return this.props.options;
  },

  _onKeyDown: function(event) {
    // We only care about intercepting backspaces
    if (event.keyCode !== KeyEvent.DOM_VK_BACK_SPACE) {
      return;
    }

    // No tokens
    if (!this.state.selected.length) {
      return;
    }

    // Remove token ONLY when bksp pressed at beginning of line
    // without a selection
    var entry = this.refs.typeahead.refs.entry.getDOMNode();
    if (entry.selectionStart == entry.selectionEnd &&
        entry.selectionStart == 0) {
      this._removeTokenForValue(
        this.state.selected[this.state.selected.length - 1]);
      event.preventDefault();
    }
  },

  _removeTokenForValue: function(value) {
    var index = this._keyInSelected(value);
    if (index == -1) {
      return;
    }

    this.state.selected.splice(index, 1);
    this.setState({selected: this.state.selected});
    this.props.onTokenRemove(value);
    return;
  },

  _keyInSelected: function(value) {
    for (var i=0; i<this.state.selected.length; i++) {
      var obj = this.state.selected[i];
      if (obj.name === value) {
        return i;
      }
    }
    return -1;
  },

  _addTokenForValue: function(value) {
    if (this._keyInSelected(value) != -1) {
      this.props.onDuplicateAdd(value);
      return;
    }
    this.props.onTokenAdd(value);
    var obj = { name : value, perm : false};
    this.state.selected.push(obj);
    this.setState({selected: this.state.selected});
    this.refs.typeahead.setEntryText("");
  },

  render: function() {
    var classes = {};
    classes[this.props.customClasses.typeahead] = !!this.props.customClasses.typeahead;
    var classList = classNames(classes);
    return (
      React.createElement("div", {className: "typeahead-tokenizer"}, 
         this._renderTokens(), 
        React.createElement(Typeahead, {ref: "typeahead", 
          className: classList, 
          placeholder: this.props.placeholder, 
          inputProps: this.props.inputProps, 
          allowCustomValues: this.props.allowCustomValues, 
          customClasses: this.props.customClasses, 
          options: this._getOptionsForTypeahead(), 
          defaultValue: this.props.defaultValue, 
          maxVisible: this.props.maxVisible, 
          onOptionSelected: this._addTokenForValue, 
          onKeyDown: this._onKeyDown, 
          filterOption: this.props.filterOption})
      )
    );
  }
});

module.exports = TypeaheadTokenizer;
