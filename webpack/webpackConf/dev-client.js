require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?timeout=20000&reload=true')

hotClient.subscribe(function (event) {
    if (event.action === 'reload') {
        window.location.reload()
    }
})