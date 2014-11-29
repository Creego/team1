/** @jsx React.DOM */
var React = require('react');
var Router = require('react-router');

var SearchActionCreators = require('../actions/SearchActionCreators');
var Network = require('../lib/Network');
var WeatherStore = require('../stores/WeatherStore');


var App = React.createClass({
    mixins: [Router.State],

    getInitialState: function () {
        return {
            isConnected: Network.isConnected(),
            isLoading: true
        };
    },

    componentDidMount: function () {
        Network.on('connect', this._onNetworkConnected);
        Network.on('disconnect', this._onNetworkDisconnected);
        WeatherStore.on('change', this._onWeatherStoreChange);

        this.setState({ isConnected: Network.isConnected() });

        var cityName = this.getPathname().match(/^\/([^/]+)(\/(details|climate))?\/?$/);
        if (cityName !== null && Object.prototype.toString.call(cityName[1])) {
            SearchActionCreators.newCity(cityName[1]);
        }
    },

    componentWillUnmount: function () {
        Network.removeListener('connect', this._onNetworkConnected);
        Network.removeListener('disconnect', this._onNetworkDisconnected);
        WeatherStore.removeListener('change', this._onWeatherStoreChange);
    },

    render: function () {
        return <Router.RouteHandler />;
    },

    _onNetworkConnected: function () {
        this.setState({ isConnected: true });
    },

    _onNetworkDisconnected: function () {
        this.setState({ isConnected: false });
    },

    _onWeatherStoreChange: function () {
        this.setState({ isLoading: WeatherStore.isLoading() });
    }
});


module.exports = App;
