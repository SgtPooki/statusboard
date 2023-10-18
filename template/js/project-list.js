'use strict'
/* eslint-env browser */
const { LitElement, html } = require('es5-lit-element')

class ProjectList extends LitElement {
  constructor (...args) {
    super(...args)
    this.projectGithubUrls = new Set()
  }

  static get properties () {
    return {
      config: { type: Object },
      projects: { type: Object }
    }
  }

  getProjectRootGithubUrl = (project) => {
    if (project.repoDetails && project.repoDetails.url) {
      return (project.repoDetails && project.repoDetails.url) || `https://www.github.com/${project.repoOwner}/${project.repoName}`
    }

    return `https://www.github.com/${project.repoOwner}/${project.repoName}`
  }

  getProjectTitleCell (project) {
    const lines = [
      html`<a href="https://www.github.com/${project.repoOwner}" target="_blank">${project.repoOwner}</a>`,
      html`<a href="${this.getProjectRootGithubUrl(project)}" target="_blank">${project.repoName}</a>`
    ]

    if (project.repoDirectory !== '/') {
      lines.push(html`<a href="https://www.github.com/${project.repoOwner}/${project.repoName}/tree/${project.repoBranch}/${project.repoDirectory.replace('./', '')}" target="_blank">${project.repoDirectory.replace('./', '')}</a>`)
    }

    return html`
      <td>
        ${lines.map((line, i) => html`${i === 0 ? '' : ' / '}${line}`)}
      </td>
    `
  }

  getRow = (project) => {
    let duplicateGithubUrl = false
    const githubUrl = this.getProjectRootGithubUrl(project)
    if (this.projectGithubUrls.has(githubUrl)) {
      duplicateGithubUrl = true
    } else {
      this.projectGithubUrls.add(this.getProjectRootGithubUrl(project))
    }

    return html`
      <tr>
        ${this.getProjectTitleCell(project)}
        <td title="Stars">
          ${duplicateGithubUrl ? '↑' : html`<a href="https://npmjs.org/package/${project.packageName}">
            <img src="https://badgen.net/github/stars/${project.repo}?color=yellow" />
          </a>`}
        </td>
        <td title="Watchers">
          ${duplicateGithubUrl ? '↑' : html`<a href="https://www.github.com/${project.repo}">
            <img src="https://badgen.net/github/watchers/${project.repo}" />
          </a>`}
        </td>
        <td title="Issues">
          ${duplicateGithubUrl ? '↑' : html`<a href="https://www.github.com/${project.repo}">
            <img src="https://badgen.net/github/open-issues/${project.repo}" />
          </a>`}
        </td>
        <td title="PRs">
          ${duplicateGithubUrl ? '↑' : html`<a href="https://www.github.com/${project.repo}">
            <img src="https://badgen.net/github/open-prs/${project.repo}" />
          </a>`}
        </td>
        <td title="commits">
          ${duplicateGithubUrl ? '↑' : html`<a href="https://www.github.com/${project.repo}">
            <img src="https://badgen.net/github/commits/${project.repo}" />
          </a>`}
        </td>
        <td title="License">
          ${duplicateGithubUrl ? '↑' : html`<a href="https://www.github.com/${project.repo}">
            <img src="https://badgen.net/github/license/${project.repo}" />
          </a>`}
        </td>
        <td title="Contributors">
          ${duplicateGithubUrl ? '↑' : html`<a href="https://www.github.com/${project.repo}">
            <img src="https://badgen.net/github/contributors/${project.repo}" />
          </a>`}
        </td>
        <td>
          ${project.skipNpm ? '' : project.packageJson && (html`
            <a href="https://npmjs.org/package/${project.packageName}">
              <img src="https://badgen.net/npm/v/${project.packageName}" />
            </a>
          `)}
        </td>
        <td>
          ${project.skipNpm ? '' : project.packageJson && (html`
            <a href="https://npmjs.org/package/${project.packageName}">
              <img src="https://badgen.net/npm/dm/${project.packageName}" />
            </a>
          `)}
        </td>
        <td>
          ${project.travis && (html`
            <a href="https://travis-ci.org/${project.repo}">
              <img src="https://badgen.net/travis/${project.repo}" />
            </a>
          `)}
        </td>
      </tr>
    `
  }

  /**
   *
   */
  renderTotals() {
    const setOfProjectGithubUrls = new Set()
    const totals = this.projects.reduce((acc, project) => {
      const projectGithubUrl = this.getProjectRootGithubUrl(project)
      const alreadyAddedForRepo = setOfProjectGithubUrls.has(projectGithubUrl)
      setOfProjectGithubUrls.add(projectGithubUrl)
      if (project.repoDetails != null) {
        if (!alreadyAddedForRepo) {
          acc.stars += project.repoDetails.stars
          acc.watchers += project.repoDetails.watchers
          acc.forks += project.repoDetails.forks
          acc.openIssues += project.repoDetails.openIssues
          acc.pullRequests += (project.repoDetails.pullRequests || 0)
          console.log(`${project.repoDetails.url}: project.repoDetails.pullRequests: `, project.repoDetails.pullRequests);
          console.log(`${project.repoDetails.url}: project.repoDetails: `, project.repoDetails);
        }
      } else {
        console.log(`no repo details for ${project.repo} at ${project.repoDetails.url}`)
      }
      return acc
    }, {stars: 0, watchers: 0, forks: 0, openIssues: 0, pullRequests: 0})
    return html`
      <tr>
        <td><b>Totals</b></td>
        <td>${totals.stars}</td>
        <td>${totals.watchers}</td>
        <td>${totals.openIssues}</td>
        <td>${totals.pullRequests}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    `
  }

  render () {
    return html`
      <link rel="stylesheet" href="${this.config.files.css.projectList}" />
      <h2>Projects</h2>
      <table class="project-list">
        ${this.projects.map(this.getRow)}
        ${this.renderTotals()}
      </table>
    `
  }
}
customElements.define('statusboard-project-list', ProjectList)
