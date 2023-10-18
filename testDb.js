'use strict';
const level = require('level')
const readline = require('readline/promises')

async function main () {
  try {
    const db = level('./gh-pages/data.db', {
      valueEncoding: 'json'
    })

    for await (let { key, value } of db.createReadStream()) {
      // log the key and value
      console.log(key, value)

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      // prompt user to continue or quit
      const answer = await rl.question('Continue? (n to quit)');

      rl.close()
      if (answer.toLowerCase() === 'n') {
        break
      }
    }
  } catch (err) {
    console.error(err)
  }
}

main()
  .catch((e) => {
    console.error(e)
  })
