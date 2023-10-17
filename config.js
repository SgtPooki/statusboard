'use strict'
const path = require('path')

module.exports = {
  db: path.join(__dirname, 'tmp', 'data.db'),
  baseUrl: '/statusboard',
  outputDirectory: path.join(__dirname, 'tmp'),
  github: {
    token: process.env.GITHUB_TOKEN
  },

  title: 'Helia StatusBoard',
  description: 'StatusBoard',

  // orgs: [
  //   'ipfs'
  // ],
  /** @type {import('./types.js').Project} */
  projects: [
    // 'nodejs/package-maintenance',
    {
      name: 'Helia',
      repo: 'ipfs/helia',
      repoBranch: 'main'
    },
    {
      name: 'Helia Examples',
      repo: 'ipfs-examples/helia-examples'
    },
    'ipfs/helia-docker',
    'ipfs/helia-remote-pinning',
    'ipfs/helia-routing-v1-http-api',
    'ipfs/helia-unixfs',
    'ipfs/helia-strings',
    'ipfs/helia-car',
    'ipfs/helia-json',
    'ipfs/helia-dag-cbor',
    'ipfs/helia-ipns',
    'ipfs/helia-mfs',
    'ipfs/helia-dag-json',
    'ipfs/helia-cli'
  ],

  issueLabels: ['need/triage', 'P0', 'P1', 'P2', 'P3', 'good first issue', 'help wanted', 'status/ready'],

  people: [
    {
      name: 'Russell Dempsey',
      email: '1173416+SgtPooki@users.noreply.github.com',
      website: 'http://www.github.com/SgtPooki',
      npmUsername: 'sgtpooki',
      githubUsername: 'sgtpooki',
      twitterUsername: 'sgtpooki'
    }
  ]
}
