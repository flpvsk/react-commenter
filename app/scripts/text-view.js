/** @jsx React.DOM */
'use strict';
define(['storage', 'paragraph'], function(Storage, Paragraph) {
  return React.createClass({
    displayName: 'TextView',

    render: function() {
      var textId = this.props.textId,
        text = Storage.getText(textId),
        paragraphs;

      paragraphs = text.paragraphIds.map(function(id) {
        return Paragraph( {paragraphId:id} )
      });

      return (
        React.DOM.section(null, 
          React.DOM.article(null, 
            React.DOM.header(null, 
              React.DOM.h2(null, text.header)
            ),
            paragraphs
          ),

          React.DOM.a( {href:"#/"}, "Back")
        )
      );
    }
  });
});
