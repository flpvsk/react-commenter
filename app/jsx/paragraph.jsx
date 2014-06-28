/** @jsx React.DOM */
'use strict';
define(['lodash', 'storage', 'comment-list', 'comment-add', 'comment-view'],
    function(_, Storage, CommentList, CommentAdd, CommentView) {

  return React.createClass({
    displayName: 'Paragraph',


    getInitialState: function() {
      return {
        showComments: false,
        showAddCommentTooltip: false,
        showAddCommentForm: false,
        selectedComment: null,
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

      this.props.onShowComments();
    },


    showAddCommentForm: function() {
      this.setState({
        showComments: true,
        showAddCommentForm: true,
        showAddCommentTooltip: false,
        selectedComment: null
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


    handleCommentSelect: function(comment) {
      return function() {
        this.setState({
          selectedComment: comment
        });
      }.bind(this);
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
        showAddCommentForm: false
      });
    },


    handleCommentDelete: function() {
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
          content = <p>{p.content}</p>,
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
            <p>
              {beg}
                <span className={highlightClasses}>
                  {hl}
                  <span className="tooltip">
                    <a href="javascript:void(0)"
                      onClick={this.showAddCommentForm}>
                      Comment
                    </a>
                  </span>
                </span>
              {end}
            </p>
        );
      }

      comments = Storage.getCommentsByParagraphId(p.id)
        .map(function(comment) {
          return <CommentView
            comment={comment}
            onMouseEnter={this.highlightCorrespondingText(comment)}
            onMouseLeave={this.clearHighlight} />
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
          <div className={paragraphClasses}>
            {content}

            <div className="comments">
              <a href="javascript:void(0)"
                onClick={this.hideComments}>Hide comments
              </a>

              <div className={commentNewClasses}>
                <CommentAdd className="comment-new-form"
                  paragraph={p}
                  highlight={highlight}
                  onClose={this.hideAddCommentForm} />
                <a href="javascript:void(0)"
                  className="comment-new-icon"
                  onClick={this.showAddCommentForm}>Add comment</a>
              </div>

              <div className="comment-list">
                {comments}
              </div>

            </div>

            <div className="comments-number"
              onClick={this.showComments}>
              <a href="javascript:void(0)" className="comments-number-icon"
                onClick={this.showComments}>
                {comments.length || '+'}
              </a>
            </div>
          </div>
      );
    }
  });
});
