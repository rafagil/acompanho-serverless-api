const CategoriesFunction = require('./categories');
CategoriesFunction({
    res: null,
    done: function () { console.log(this.res); process.exit()},
    log: console.log
}, { method: "GET", params: {} })