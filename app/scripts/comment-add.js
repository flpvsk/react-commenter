/** @jsx React.DOM */
'use strict';
define(['storage'], function(Storage) {

  return React.createClass({
    displayName: 'CommentAdd',

    getInitialState: function() {
      return {content: ''};
    },


    handleChange: function(ev) {
      this.setState({content: ev.target.value});
    },


    addComment: function() {
      var paragraphId = this.props.paragraph.id,
          highlight = this.props.highlight;

      if (!this.state.content.length) { return; }
      Storage.addComment(paragraphId, this.state.content, highlight);
      this.setState({content: ''});
    },

    render: function() {
      return (
        React.DOM.div( {className:this.props.className}, 
          React.DOM.textarea(
            {onChange:this.handleChange,
            value:this.state.content}
          ),
          React.DOM.button( {onClick:this.addComment}, "Add"),
          React.DOM.button( {onClick:this.props.onClose}, "Close")
        )
      )
    }
  });
});
