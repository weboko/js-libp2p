'use strict'

const path = require('path')
const execa = require('execa')
const pDefer = require('p-defer')
const { toString: uint8ArrayToString } = require('uint8arrays/to-string')

async function test() {
  const messageDefer = pDefer()
  process.stdout.write('1.js\n')

  const proc = execa('node', [path.join(__dirname, '1.js')], {
    cwd: path.resolve(__dirname),
    all: true
  })

  proc.all.on('data', async (data) => {
    process.stdout.write(data)

    const line = uint8ArrayToString(data)

    if (line.includes('my own protocol, wow!')) {
      messageDefer.resolve()
    }
  })

  await messageDefer.promise
  proc.kill()
}

module.exports = test
