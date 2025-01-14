var capacitorSource = (function (exports, core) {
    'use strict';

    const Source = core.registerPlugin('Source', {
        web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.SourceWeb()),
    });

    class SourceWeb extends core.WebPlugin {
        async echo(options) {
            console.log('ECHO', options);
            return options;
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SourceWeb: SourceWeb
    });

    exports.Source = Source;

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
