'use strict'
const github = require('../github')
const npm = require('../npm')
const { Project } = require('../project')
const path = require('path')
const utils = require('./utils')

module.exports = async function buildIndex (config, db) {
  // Loop projects
  for await (let evt of iterateProjects(config)) {
    const { type, project, detail } = evt
    let key = utils.getKeyForProject(project, type)
    switch (type) {
      case 'ISSUE':
        key += `:${detail.number}`
        break
      case 'ACTIVITY':
        key += `:${detail.id}`
        break
      case 'COMMIT':
        key += `:${detail.nodeId}`
        break
      case 'ERROR':
        console.log(evt)
        continue
    }

    await db.put(key, evt)
  }
}

async function * iterateProjects (config) {
  const [octokit, graphQL] = await github(config.github)

  // Load projects
  for (let proj of config.projects) {
    for await (let evt of loadProject(octokit, graphQL, proj, config)) {
      yield evt
    }
  }

  // Load projects for org
  for (let org of config.orgs) {
    try {
      for await (let repo of github.getOrgRepos(graphQL, org.name)) {
        const proj = new Project({
          repoOwner: repo.owner,
          repoName: repo.name
        })
        for await (let evt of loadProject(octokit, graphQL, proj, config, repo)) {
          yield evt
        }
      }
    } catch (e) {
      yield projectDetail('ERROR', org, e)
    }
  }
}

async function * loadProject (octokit, graphQL, project, config, _repo) {
  // If listed from org we already have the repo
  let repo = _repo
  if (!repo) {
    try {
      repo = await github.getRepo(graphQL, project.repoOwner, project.repoName)
    } catch (e) {
      yield projectDetail('ERROR', project, e)
    }
  }

  let pkg
  try {
    const pathToPackageJson = project.repoDirectory !== '/' ? path.join(project.repoDirectory, 'package.json') : 'package.json'
    pkg = JSON.parse(await github.getFile(graphQL, project.repoOwner, project.repoName, project.repoBranch, pathToPackageJson))
  } catch (e) {
    yield projectDetail('ERROR', project, e)
  }

  // In case the package name was not specified, get it from the package.json
  if (project.packageName == null && pkg != null) {
    project.packageName = pkg.name
  }

  // We do this now because then the project has a packageName
  if (repo) {
    yield projectDetail('REPO', project, repo)
  }

  // If we found a package.json we think it is a node package
  if (pkg) {
    yield projectDetail('PACKAGE_JSON', project, pkg)

    if (!project.skipNpm) {
      try {
        yield projectDetail(
          'PACKUMENT',
          project,
          await npm.getPackument(project.packageName)
        )
      } catch (e) {
        yield projectDetail('ERROR', project, e)
      }

      try {
        yield projectDetail(
          'PACKAGE_MANIFEST',
          project,
          await npm.getManifest(project.packageName)
        )
      } catch (e) {
        yield projectDetail('ERROR', project, e)
      }
    }
  }

  try {
    const pathToReadme = project.repoDirectory !== '/' ? path.join(project.repoDirectory, 'README.md') : 'README.md'
    yield projectDetail(
      'README',
      project,
      await github.getFile(graphQL, project.repoOwner, project.repoName, project.repoBranch, pathToReadme)
    )
  } catch (e) {
    yield projectDetail('ERROR', project, e)
  }

  // try {
  //   yield projectDetail(
  //     'TRAVIS',
  //     project,
  //     await files.getTravisConfig(project)
  //   )
  // } catch (e) {
  //   yield projectDetail('ERROR', project, e)
  // }

  try {
    for await (let issue of github.getRepoIssues(graphQL, project.repoOwner, project.repoName)) {
      yield projectDetail('ISSUE', project, issue)
    }
  } catch (e) {
    yield projectDetail('ERROR', project, e)
  }

  try {
    for await (let activity of github.getRepoActivity(octokit, project.repoOwner, project.repoName)) {
      yield projectDetail('ACTIVITY', project, activity)
    }
  } catch (e) {
    yield projectDetail('ERROR', project, e)
  }

  try {
    for await (let commit of github.getRepoCommits(graphQL, project.repoOwner, project.repoName, project.repoBranch)) {
      yield projectDetail('COMMIT', project, commit)
    }
  } catch (e) {
    yield projectDetail('ERROR', project, e)
  }
}

function projectDetail (type, project, detail) {
  return { type, project, detail }
}
