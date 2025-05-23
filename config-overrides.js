// config-overrides.js (необходимо установить react-app-rewired)
module.exports = function override(config) {
    config.plugins = config.plugins.map(plugin => {
        if (plugin.constructor.name === 'GenerateSW') {
            return new InjectManifest({
                swSrc: './public/service-worker.js',
                swDest: 'service-worker.js'
            });
        }
        return plugin;
    });
    return config;
};