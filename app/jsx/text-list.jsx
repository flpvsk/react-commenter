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
        return <li><a href={textPath}>{text.header}</a></li>;
      });

      return (
        <section>
          <h2>Texts</h2>
          <ul><h3>{list}</h3></ul>
          <a href="#/add">Add</a>
        </section>
      )
    }
  });
});
