/** @jsx React.DOM */
'use strict';

require.config({
	baseUrl: 'scripts',
	paths: {
		react: 'script/react.min',
    lodash: '../bower_components/lodash/dist/lodash'
	},
	shim: {
		react: {
			exports: 'React'
		},
    lodash: {
      exports: '_'
    }
	}
});

require(['app'], function (App) {
	// use app here
	React.renderComponent(
		App(null ),
		document.getElementById('app')
	);
});
