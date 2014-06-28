/** @jsx React.DOM */
'use strict';
define(['storage'], function(storage) {
  return React.createClass({
    displayName: 'TextShow',

    render: function() {
      var textId = this.props.textId,
        text = Storage.getText(textId),
        paragraphs = Storage.findParagraphsByTextId(textId);
    }
  });
});
