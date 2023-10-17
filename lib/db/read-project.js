'use strict'
const utils = require('./utils')

/**
 * This never seems to be called.
 *
 * @deprecated
 */
module.exports = async function * (db, project, type) {
  const key = utils.getKeyForProject(project, type)

  const stream = db.createReadStream({
    gte: `${key}`,
    lte: `${key}~`
  })

  for await (const item of stream) {
    yield item
  }
}
