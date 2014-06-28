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
        <section>
          <h2>Add Text</h2>
          <input onChange={this.headerChange} value={this.state.header} />
          <textarea onChange={this.textChange} value={this.state.text} />

          <div>
            <button onClick={this.addText} class="btn btn-add">Add</button>
          </div>

          <a href="#/">Back</a>
        </section>
      );
    }
  });
});
