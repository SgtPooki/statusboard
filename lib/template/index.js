'use strict'
const { readFullIndex } = require('../db')

/**
 * This function is the entry point for the template engine (i.e. `statusboard site`).
 *
 * 1. It is called from the `createBoard` function in `lib/cli.js`
 * 2. which is passed an anonymous `create` function as it's first arg from `bin/statusboard`
 * 3. and `bin/statusboard`'s create function simply returns the default export function from `<root>index.js`
 *
 * The data is read from the database and passed to the template function's defined in the config's `indicies` property,
 * which by default is set to `<root>/template/indicies.js`.
 *
 * @param {import('../config')} config
 * @param {import('level').LevelDB} db
 */
module.exports = async function (config, db) {
  const { indicies, template } = config
  const accumulator = {}

  // Read full index
  for await (let { key, value } of readFullIndex(db)) {
    await Promise.all(Object.keys(indicies).map(async (index) => {
      accumulator[index] = await indicies[index](accumulator[index], config, key, value)
    }))
  }

  await template(config, accumulator)
}
