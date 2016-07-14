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
    onTokenApprove: React.PropTypes.func,
    onTokenDisapprove: React.PropTypes.func,
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
      onTokenApprove: function() {},
      onDuplicateAdd: function() {},
    };
  },

  focus: function(){
    this.refs.typeahead.focus();
  },

  // TODO: Support initialized tokens
  //
  _renderTokens: function() {
    var tokenClasses = {};
    tokenClasses[this.props.customClasses.token] = !!this.props.customClasses.token;
    //add normal tokens
    var result = this.state.selected.map(function(selected, idx) {
      return (
        React.createElement(Token, {
        className: classNames(tokenClasses, (!!selected.class ? selected.class : '')), 
        onRemove:  this._removeTokenForValue, 
        onApprove:  this._approveTokenForValue, 
        onDisapprove:  this._disapproveTokenForValue, 
        isPermanent: selected.perm, 
        isSuggested: selected.suggested, 
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
    //do nothing no (used to be to backspace delete tokens)
  },

  _approveTokenForValue: function(value) {
    this.props.onTokenApprove(value);
    return;
  },

  _disapproveTokenForValue: function(value) {
    var index = this._keyInSelected(value);
    if (index == -1) {
      return;
    }

    this.state.selected.splice(index, 1);
    this.setState({selected: this.state.selected});
    this.props.onTokenDisapprove(value);
    return;
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
      var value = typeof value === 'object' ? (value.name || '') : value;
      if (obj.name.toLowerCase() === value.toLowerCase()) {
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
    var obj = { name : value, perm : false, class : 'M'}; //Class is automatically 'M' because you can only enter manual tags
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
