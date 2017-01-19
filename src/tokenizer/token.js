var React = require('react');
var classNames = require('classnames');

/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */
var Token = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    isPermanent: React.PropTypes.bool,
    isSuggested: React.PropTypes.bool,
    className: React.PropTypes.string,
    children: React.PropTypes.string,
    onRemove: React.PropTypes.func,
    onApprove: React.PropTypes.func,
    onDisapprove: React.PropTypes.func,
    object: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]),
    value: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      onApprove: function() {},
      onDisapprove: function() {},
    };
  },

  getInitialState: function(){
    return {
      isSuggested: this.props.isSuggested
    };
  },

  render: function() {
    var actions;
    if (!this.props.isPermanent && !this.state.isSuggested){
      actions = this._renderCloseButton();
    } else if (this.state.isSuggested) {
      actions = this._renderSuggestedConfirmation();
    }

    var className = classNames(
      "typeahead-token",
      this._isSpecialTag(this.props.name),
      this.props.className
    );

    return (
      <div className={className}>
        {this._renderHiddenInput()}
        {this._renderTagTypeIcon()} {'\u00A0'}
        {this.props.name}
        {actions}
      </div>
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
      <input
        type="hidden"
        name={ this.props.name + '[]' }
        value={ this.props.value || this.props.object }
      />
    );
  },

  _renderTagTypeIcon: function() {
    var icon;
    if (this.props.className == 'S') {
      icon = (
        <i className="fa fa-lightbulb-o tagtype-icon"></i>
      );
    } else if (this.props.className == 'K') {
      icon = (
        <i className="fa fa-bookmark-o tagtype-icon"></i>
      );
    }
    return icon;
  },

  _renderSuggestedConfirmation: function() {
    return (
      <span className="typeahead-token-controls">
        <a className="typeahead-token-check" href="#" onClick={function(event) {
            event.preventDefault();
            this.props.onApprove(this.props.name);
            this.setState({
              isSuggested: false,
            });
          }.bind(this)}><i className="fa fa-check"/></a>
        <a className="typeahead-token-close" href="#" onClick={function(event) {
            event.preventDefault();
            this.props.onDisapprove(this.props.name);
          }.bind(this)}><i className="fa fa-times"/></a>
      </span>
    );
  },

  _renderCloseButton: function() {
    if (!this.props.onRemove) {
      return "";
    }
    return (
      <span className="typeahead-token-controls">
        <a className="typeahead-token-close" href="#" onClick={function(event) {
          this.props.onRemove(this.props.object);
          event.preventDefault();
        }.bind(this)}><i className="fa fa-times"/></a>
      </span>
    );
  }

});

module.exports = Token;
