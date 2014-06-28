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
        return <Paragraph paragraphId={id} />
      });

      return (
        <section>
          <article>
            <header>
              <h2>{text.header}</h2>
            </header>
            {paragraphs}
          </article>

          <a href="#/">Back</a>
        </section>
      );
    }
  });
});
