'use strict';
define(['lodash'], function(_) {
  var localStorage = window.localStorage,
      _callbacks = {
        'add-comment': [],
        'delete-comment': []
      };

  function _id() {
    return Math.random().toString(36).slice(2, 8);
  }

  function _put(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  function _get(key, fallback) {
    if (!fallback) fallback = null;
    return JSON.parse(localStorage.getItem(key)) || fallback;
  }

  function _delete(key) {
    return localStorage.removeItem(key);
  }

  function _notify(event) {
    _callbacks[event].forEach(function (cb) {
      cb()
    });
  }

  return {

    // Store all paragraphs and the text object itself
    addText: function(header, text) {
      var textId = _id(),
          textObj,
          paragraphs;

      if (!text.length) {
        throw new Error('Text can not be empty');
      }

      if (!header.length) {
        throw new Error('Header can not be empty');
      }

      textObj = {
        id: textId,
        header: header,
        paragraphIds: []
      };

      paragraphs = text
        .split('\n')
        .filter(function(l) { return l.length > 0; })
        .map(function(content) {
          // generate paragraph objects
          // each one will have unique id and any non-empty content
          return {id: _id(), content: content};
        })
        .forEach(function (paragraph) {
          // store each paragraph object
          _put('paragraph/' + paragraph.id, paragraph);
          textObj.paragraphIds.push(paragraph.id);
        });

       // store text object itself
      _put('text/' + textId, textObj);
      return textObj;
    },


    getTextIds: function() {
      return Object.keys(localStorage)
        .filter(function(key) {
          return key.indexOf('text/') === 0;
        })
        .map(function(key) {
          return key.substr(5);
        });
    },


    getTexts: function() {
      return Object.keys(localStorage)
        .filter(function(key) {
          return key.indexOf('text/') === 0;
        })
        .map(_get);
    },


    getText: function(id) {
      return _get('text/' + id);
    },


    getParagraph: function(id) {
      return _get('paragraph/' +id);
    },


    addComment: function(pId, content, highlight) {
      var commentId = _id(),
          existingCommentIds,
          pCommentsKey,
          newComment;

      newComment = {
        id: commentId,
        content: content,
        paragraphId: pId
      };

      if (highlight.length) newComment.highlight = highlight;

      _put('comment/' + commentId, newComment);

      pCommentsKey = 'paragraph/' + pId + '/comments';
      existingCommentIds = _get(pCommentsKey, []);
      _put(pCommentsKey, existingCommentIds.concat(commentId));

      _notify('add-comment');

      return newComment;
    },


    deleteComment: function(id) {
      var comment = _get('comment/' + id),
          pCommentsKey = 'paragraph/' + comment.paragraphId + '/comments',
          pCommentIds;

      pCommentIds = _get(pCommentsKey);
      _put(pCommentsKey, _.without(pCommentIds, id));
      _delete('comment/' + id);
      _notify('delete-comment');
    },


    getCommentsByParagraphId: function(pId) {
      return _get('paragraph/' + pId + '/comments', [])
        .map(function(commentId) {
          return _get('comment/' + commentId);
        })
    },

    on: function(event, cb) {
      _callbacks[event].push(cb);
    },


    off: function(event, cb) {
      _callbacks[event] = _.without(_callbacks[event], cb);
    }

  };
});
