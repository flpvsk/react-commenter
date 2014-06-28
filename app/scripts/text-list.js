/** @jsx React.DOM */
'use strict';
define(['storage'], function(Storage) {
  return React.createClass({
    displayName: 'TextList',

    render: function() {
      var texts = Storage.getTexts(),
        list;

      list = texts.map(function (text){
        var textPath = '#/text/' + text.id;
        return React.DOM.li(null, React.DOM.a( {href:textPath}, text.header));
      });

      return (
        React.DOM.section(null, 
          React.DOM.h2(null, "Texts"),
          React.DOM.ul(null, React.DOM.h3(null, list)),
          React.DOM.a( {href:"#/add"}, "Add")
        )
      )
    }
  });
});
