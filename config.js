'use strict'
const path = require('path')

function convertMonoRepoToProjectsArray (repo, names, configOverrides = {}) {
  return names.map(name => {
    return {
      // name,
      repo,
      repoDirectory: `./packages/${name}`,
      ...configOverrides
    }
  })
}

module.exports = {
  db: path.join(__dirname, 'tmp', 'data.db'),
  baseUrl: '/statusboard',
  outputDirectory: path.join(__dirname, 'tmp'),
  github: {
    token: process.env.GITHUB_TOKEN
  },

  title: 'Helia StatusBoard',
  description: 'StatusBoard',

  orgs: [],

  /** @type {import('./types.js').Project} */
  projects: [
    ...convertMonoRepoToProjectsArray('ipfs/helia', ['helia', 'interface']),
    {
      name: 'Helia Examples',
      repo: 'ipfs-examples/helia-examples',
      skipNpm: true
    },
    {
      repo: 'ipfs/helia-docker',
      skipNpm: true
    },
    'ipfs/helia-remote-pinning',
    ...convertMonoRepoToProjectsArray('ipfs/helia-routing-v1-http-api', ['client', 'server']),
    'ipfs/helia-unixfs',
    'ipfs/helia-strings',
    'ipfs/helia-car',
    'ipfs/helia-json',
    'ipfs/helia-dag-cbor',
    'ipfs/helia-ipns',
    'ipfs/helia-mfs',
    'ipfs/helia-dag-json',
    { repo: 'ipfs/helia-cli', skipNpm: true }
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
