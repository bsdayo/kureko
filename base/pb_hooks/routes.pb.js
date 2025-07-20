/// <reference path="../pb_data/types.d.ts" />

routerAdd('GET', '/api/config', (e) => {
  return e.json(200, require(`${__hooks}/../config.js`))
})
