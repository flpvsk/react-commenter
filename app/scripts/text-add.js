/** @jsx React.DOM */
'use strict';
define(['storage'], function (Storage) {
  return React.createClass({
    displayName: 'TextAdd',
    mixins: [React.addons.LinkedStateMixin],

    getInitialState: function() {
      return {'text': '', 'header': ''}
    },

    headerChange: function (ev) {
      this.setState({header: ev.target.value})
    },

    textChange: function(ev) {
      this.setState({text: ev.target.value})
    },

    addText: function() {
      Storage.addText(this.state.header, this.state.text);
    },

    render: function() {
      return (
        React.DOM.section(null, 
          React.DOM.h2(null, "Add Text"),
          React.DOM.input( {onChange:this.headerChange, value:this.state.header} ),
          React.DOM.textarea( {onChange:this.textChange, value:this.state.text} ),

          React.DOM.div(null, 
            React.DOM.button( {onClick:this.addText, class:"btn btn-add"}, "Add")
          ),

          React.DOM.a( {href:"#/"}, "Back")
        )
      );
    }
  });
});
