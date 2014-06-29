/** @jsx React.DOM */
'use strict';
define(['lodash', 'storage', 'comment-list', 'comment-add', 'comment-view'],
    function(_, Storage, CommentList, CommentAdd, CommentView) {

  return React.createClass({
    displayName: 'Paragraph',


    getInitialState: function() {
      return {
        // comments block includes:
        //   all comments
        //   add comment link
        //   add comment form
        //   hide comments link
        showComments: false,
        // tooltip is shown above highlighted text
        showAddCommentTooltip: false,
        showAddCommentForm: false,
        // [start, end] positions of piece of text to highlight
        highlight: []
      };
    },


    showAddCommentTooltip: function(start, end) {
      this.setState({
        showAddCommentTooltip: true,
        highlight: [start, end]
      });
    },


    showComments: function () {
      this.setState({
        showComments: true,
        showAddCommentTooltip: false
      });
    },


    showAddCommentForm: function() {
      this.setState({
        showComments: true,
        showAddCommentForm: true,
        showAddCommentTooltip: false,
      });
    },


    hideAddCommentForm: function() {
      this.setState({
        showAddCommentForm: false,
        highlight: []
      });
    },


    hideComments: function() {
      this.setState(this.getInitialState());
    },


    hideAddCommentTooltip: function() {
      if (this.state.showAddCommentTooltip) {
        this.setState(this.getInitialState());
      }
    },


    highlightCorrespondingText: function(comment) {
      return function() {
        this.setState({
          highlight: comment.highlight || []
        });
      }.bind(this);
    },


    clearHighlight: function() {
      this.setState({
        highlight: []
      });
    },


    handleCommentAdd: function() {
      this.setState({
        showAddCommentForm: false,
        highlight: []
      });
    },


    handleCommentDelete: function() {
      this.setState({
        highlight: []
      });
      this.forceUpdate();
    },


    handleMouseUp: function(ev) {
      var selection = window.getSelection(),
          anchorNode = selection.anchorNode,
          focusNode = selection.focusNode;

      if (event.target.nodeName === 'A') {
        return true;
      }

      if (selection.type !== 'Range' || selection.rangeCount === 0) {
        this.hideAddCommentTooltip();
        return;
      }

      if (anchorNode !== focusNode) {
        // user selected different paragraphs, ignore
        return;
      }


      // XX
      if (anchorNode.parentNode.parentNode !== this.getDOMNode()) {
        // text in different paragraph has been selected
        this.hideAddComment();
        return;
      }

      // text in current paragraph has been selected, handle it here
      this.showAddCommentTooltip(selection.anchorOffset,
          selection.focusOffset);
    },


    componentDidMount: function() {
      window.addEventListener('mouseup', this.handleMouseUp);
      Storage.on('add-comment', this.handleCommentAdd);
      Storage.on('delete-comment', this.handleCommentDelete);
    },


    componentWillUnmount: function() {
      window.removeEventListener('mouseup', this.handleMouseUp);
      Storage.off('add-comment', this.handleCommentAdd);
      Storage.off('delete-comment', this.handleCommentDelete);
    },


    render: function() {
      var p = Storage.getParagraph(this.props.paragraphId),
          highlight = this.state.highlight,
          content = React.DOM.p(null, p.content),
          comments,
          highlightClasses,
          paragraphClasses,
          commentNewClasses;

      // parts of text, when highlighted
      var beg, hl, end;

      if (highlight.length) {
        // Split the text, highlight part in the middle

        highlightClasses = React.addons.classSet({
          'highlight': true,
          'show-add-comment-tooltip': this.state.showAddCommentTooltip
        });

        beg = p.content.slice(0, highlight[0]);
        hl = p.content.slice(highlight[0], highlight[1]);
        end = p.content.slice(highlight[1]);

        content = (
            React.DOM.p(null, 
              beg,
                React.DOM.span( {className:highlightClasses}, 
                  hl,
                  React.DOM.span( {className:"tooltip"}, 
                    React.DOM.a( {href:"javascript:void(0)",
                      onClick:this.showAddCommentForm}, 
                      " Comment "
                    )
                  )
                ),
              end
            )
        );
      }

      comments = Storage.getCommentsByParagraphId(p.id)
        .map(function(comment) {
          return CommentView(
            {comment:comment,
            onMouseEnter:this.highlightCorrespondingText(comment),
            onMouseLeave:this.clearHighlight} )
        }.bind(this));

      paragraphClasses = React.addons.classSet({
        'paragraph': true,
        'paragraph-show-comments': this.state.showComments
      });

      commentNewClasses = React.addons.classSet({
        'comment-new': true,
        'comment-new-show-icon': !this.state.showAddCommentForm,
        'comment-new-show-form': this.state.showAddCommentForm
      });

      return (
          React.DOM.div( {className:paragraphClasses}, 
            content,

            React.DOM.div( {className:"comments"}, 
              React.DOM.a( {href:"javascript:void(0)",
                onClick:this.hideComments}, "Hide comments "
              ),

              React.DOM.div( {className:commentNewClasses}, 
                CommentAdd( {className:"comment-new-form",
                  paragraph:p,
                  highlight:highlight,
                  onClose:this.hideAddCommentForm} ),
                React.DOM.a( {href:"javascript:void(0)",
                  className:"comment-new-icon",
                  onClick:this.showAddCommentForm}, "Add comment")
              ),

              React.DOM.div( {className:"comment-list"}, 
                comments
              )

            ),

            React.DOM.div( {className:"comments-number",
              onClick:this.showComments}, 
              React.DOM.a( {href:"javascript:void(0)", className:"comments-number-icon",
                onClick:this.showComments}, 
                comments.length || '+'
              )
            )
          )
      );
    }
  });
});
