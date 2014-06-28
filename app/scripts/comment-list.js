/** @jsx React.DOM */
'use strict';
define(['storage', 'lodash'], function(Storage, _) {

  return React.createClass({
    displayName: 'CommentList',

    render: function() {
      return React.DOM.div(null, "COMMENTS!");
    }
  });

});
