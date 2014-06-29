/** @jsx React.DOM */
'use strict';
define(['storage', 'text-view', 'text-add', 'text-list'],
    function(Storage, TextView, TextAdd, TextList) {

  var HASH_REGEX = /^#\/?(.*)$/,
    TEXT_REGEX = /^text\/([^\/]+)$/,
    location = window.location;


	return React.createClass({
    displayName: 'App',


    getInitialState: function() {
      // set set according to location.hash or redirect to default
      var pathMatch = location.hash.match(HASH_REGEX);
      if (!pathMatch) {
        location.hash = '#/';
        return {path: ''};
      }
      return {path: pathMatch[1]}
    },


    udpateState: function () {
      var pathMatch = location.hash.match(HASH_REGEX);
      if (!pathMatch) {
        this.setState({path: ''});
        location.hash = '#/';
        return;
      }
      this.setState({path: pathMatch[1]});
    },


    componentDidMount: function() {
      window.addEventListener('hashchange', this.udpateState);
    },


    componentWillUnmount: function() {
      window.removeEventListener('hashchange', this.udpateState);
    },


    render: function() {
      var path = this.state.path,
        textPathMatch;

      // Routes

      // #/
      if (path === '') return <TextList />;

      // #/text/{text_id}
      textPathMatch = path.match(TEXT_REGEX);
      if (textPathMatch) return <TextView textId={textPathMatch[1]} />

      // #/add
      if (path === 'add') return <TextAdd />

      location.hash = '#/';
    }
	});
});
