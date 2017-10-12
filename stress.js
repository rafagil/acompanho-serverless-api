const CategoriesFunction = require('./categories');
CategoriesFunction({
    res: null,
    done: function () { console.log(this.res); process.exit()}
}, { method: "GET", params: {} })