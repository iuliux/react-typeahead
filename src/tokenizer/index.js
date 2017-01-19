var Accessor = require('../accessor');
var React = require('react');
var Token = require('./token');
var KeyEvent = require('../keyevent');
var Typeahead = require('../typeahead');
var classNames = require('classnames');

function _arraysAreDifferent(array1, array2) {
  if (array1.length != array2.length){
    return true;
  }
  for (var i = array2.length - 1; i >= 0; i--) {
    if (array2[i] !== array1[i]){
      return true;
    }
  }
}

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */
var TypeaheadTokenizer = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    options: React.PropTypes.array,
    customClasses: React.PropTypes.object,
    allowCustomValues: React.PropTypes.number,
    defaultSelected: React.PropTypes.array,
    initialValue: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    inputProps: React.PropTypes.object,
    onTokenRemove: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    onKeyPress: React.PropTypes.func,
    onKeyUp: React.PropTypes.func,
    onTokenAdd: React.PropTypes.func,
<<<<<<< HEAD
    onTokenApprove: React.PropTypes.func,
    onTokenDisapprove: React.PropTypes.func,
    onDuplicateAdd: React.PropTypes.func,
    filterOption: React.PropTypes.func,
    maxVisible: React.PropTypes.number
=======
    onFocus: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    filterOption: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]),
    searchOptions: React.PropTypes.func,
    displayOption: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]),
    formInputOption: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ]),
    maxVisible: React.PropTypes.number,
    resultsTruncatedMessage: React.PropTypes.string,
    defaultClassNames: React.PropTypes.bool
>>>>>>> dc92754b45b94e3abf741b7b0048224eaf150adf
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
      initialValue: "",
      placeholder: "",
      disabled: false,
      inputProps: {},
      defaultClassNames: true,
      filterOption: null,
      searchOptions: null,
      displayOption: function(token){ return token },
      formInputOption: null,
      onKeyDown: function(event) {},
      onKeyPress: function(event) {},
      onKeyUp: function(event) {},
      onFocus: function(event) {},
      onBlur: function(event) {},
      onTokenAdd: function() {},
      onTokenRemove: function() {},
      onTokenApprove: function() {},
      onDuplicateAdd: function() {},
    };
  },

<<<<<<< HEAD
=======
  componentWillReceiveProps: function(nextProps){
    // if we get new defaultProps, update selected
    if (_arraysAreDifferent(this.props.defaultSelected, nextProps.defaultSelected)){
      this.setState({selected: nextProps.defaultSelected.slice(0)})
    }
  },

>>>>>>> dc92754b45b94e3abf741b7b0048224eaf150adf
  focus: function(){
    this.refs.typeahead.focus();
  },

<<<<<<< HEAD
=======
  getSelectedTokens: function(){
    return this.state.selected;
  },

>>>>>>> dc92754b45b94e3abf741b7b0048224eaf150adf
  // TODO: Support initialized tokens
  //
  _renderTokens: function() {
    var tokenClasses = {};
    tokenClasses[this.props.customClasses.token] = !!this.props.customClasses.token;
<<<<<<< HEAD
    //add normal tokens
    var result = this.state.selected.map(function(selected, idx) {
      return (
        <Token
        className={classNames(tokenClasses, (!!selected.class ? selected.class : ''))}
        onRemove={ this._removeTokenForValue }
        onApprove={ this._approveTokenForValue }
        onDisapprove={ this._disapproveTokenForValue }
        isPermanent={selected.perm}
        isSuggested={selected.suggested}
        name={selected.name}/>
      )
=======
    var classList = classNames(tokenClasses);
    var result = this.state.selected.map(function(selected) {
      var displayString = Accessor.valueForOption(this.props.displayOption, selected);
      var value = Accessor.valueForOption(this.props.formInputOption || this.props.displayOption, selected);
      return (
        <Token key={displayString} className={classList}
          onRemove={this._removeTokenForValue}
          object={selected}
          value={value}
          name={this.props.name}>
          {displayString}
        </Token>
      );
>>>>>>> dc92754b45b94e3abf741b7b0048224eaf150adf
    }, this);
    return result;
  },

  _getOptionsForTypeahead: function() {
    // return this.props.options without this.selected
    return this.props.options;
  },

  _onKeyDown: function(event) {
<<<<<<< HEAD
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
=======
    // We only care about intercepting backspaces
    if (event.keyCode === KeyEvent.DOM_VK_BACK_SPACE) {
      return this._handleBackspace(event);
    }
    this.props.onKeyDown(event);
  },

  _handleBackspace: function(event){
    // No tokens
    if (!this.state.selected.length) {
      return;
    }

    // Remove token ONLY when bksp pressed at beginning of line
    // without a selection
    var entry = this.refs.typeahead.refs.entry;
    if (entry.selectionStart == entry.selectionEnd &&
        entry.selectionStart == 0) {
      this._removeTokenForValue(
        this.state.selected[this.state.selected.length - 1]);
      event.preventDefault();
    }
>>>>>>> dc92754b45b94e3abf741b7b0048224eaf150adf
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
<<<<<<< HEAD
=======
    this.props.onTokenAdd(value);
>>>>>>> dc92754b45b94e3abf741b7b0048224eaf150adf
  },

  render: function() {
    var classes = {};
    classes[this.props.customClasses.typeahead] = !!this.props.customClasses.typeahead;
    var classList = classNames(classes);
    var tokenizerClasses = [this.props.defaultClassNames && "typeahead-tokenizer"];
    tokenizerClasses[this.props.className] = !!this.props.className;
    var tokenizerClassList = classNames(tokenizerClasses)

    return (
      <div className={tokenizerClassList}>
        { this._renderTokens() }
        <Typeahead ref="typeahead"
          className={classList}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          inputProps={this.props.inputProps}
          allowCustomValues={this.props.allowCustomValues}
          customClasses={this.props.customClasses}
          options={this._getOptionsForTypeahead()}
          initialValue={this.props.initialValue}
          maxVisible={this.props.maxVisible}
          resultsTruncatedMessage={this.props.resultsTruncatedMessage}
          onOptionSelected={this._addTokenForValue}
          onKeyDown={this._onKeyDown}
          onKeyPress={this.props.onKeyPress}
          onKeyUp={this.props.onKeyUp}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          displayOption={this.props.displayOption}
          defaultClassNames={this.props.defaultClassNames}
          filterOption={this.props.filterOption}
          searchOptions={this.props.searchOptions} />
      </div>
    );
  }
});

module.exports = TypeaheadTokenizer;
