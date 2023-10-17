'use strict'
/* eslint-env browser */
const { LitElement, html } = require('es5-lit-element')

class ProjectList extends LitElement {
  static get properties () {
    return {
      config: { type: Object },
      projects: { type: Object }
    }
  }
  getProjectTitleCell (project) {
    // ${project.packageName ? ': ' + project.packageName : ''}
    const lines = [
      html`<a href="https://www.github.com/${project.repoOwner}" target="_blank">${project.repoOwner}</a>`
    ]
    if (project.repoDetails && project.repoDetails.url) {
      lines.push(html`<a href="${(project.repoDetails && project.repoDetails.url) || `https://www.github.com/${project.repoOwner}/${project.repoName}`}" target="_blank">${project.repoName}</a>`)
    } else {
      lines.push(html`<a href="https://www.github.com/${project.repoOwner}/${project.repoName}" target="_blank">${project.repoName}</a>`)
    }

    if (project.repoDirectory !== '/') {
      lines.push(html`<a href="https://www.github.com/${project.repoOwner}/${project.repoName}/tree/${project.repoBranch}/${project.repoDirectory.replace('./', '')}" target="_blank">${project.repoDirectory.replace('./', '')}</a>`)
    }
    // if (project.packageName) {
    //   lines.push(`<a href="https://npmjs.org/package/${project.packageName}" target="_blank">${project.packageName}</a>`)
    // }
    return html`
      <td>
        ${lines.map((line, i) => html`${i === 0 ? '' : ' / '}${line}`)}
      </td>
    `
  }
  render () {
    return html`
      <link rel="stylesheet" href="${this.config.files.css.projectList}" />
      <h2>Projects</h2>
      <table class="project-list">
        ${this.projects.map((project) => html`
          <tr>
            ${this.getProjectTitleCell(project)}
            <td title="Stars">
              <a href="https://npmjs.org/package/${project.packageName}">
                <img src="https://badgen.net/github/stars/${project.repo}?color=yellow" />
              </a>
            </td>
            <td title="Watchers">
              <a href="https://www.github.com/${project.repo}">
                <img src="https://badgen.net/github/watchers/${project.repo}" />
              </a>
            </td>
            <td title="Issues">
              <a href="https://www.github.com/${project.repo}">
                <img src="https://badgen.net/github/open-issues/${project.repo}" />
              </a>
            </td>
            <td title="PRs">
              <a href="https://www.github.com/${project.repo}">
                <img src="https://badgen.net/github/open-prs/${project.repo}" />
              </a>
            </td>
            <td title="commits">
              <a href="https://www.github.com/${project.repo}">
                <img src="https://badgen.net/github/commits/${project.repo}" />
              </a>
            </td>
            <td title="License">
              <a href="https://www.github.com/${project.repo}">
                <img src="https://badgen.net/github/license/${project.repo}" />
              </a>
            </td>
            <td title="Contributors">
              <a href="https://www.github.com/${project.repo}">
                <img src="https://badgen.net/github/contributors/${project.repo}" />
              </a>
            </td>
            <td>
              ${project.packageJson && (html`
                <a href="https://npmjs.org/package/${project.packageName}">
                  <img src="https://badgen.net/npm/v/${project.packageName}" />
                </a>
              `)}
            </td>
            <td>
              ${project.packageJson && (html`
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
        `)}
      </table>
    `
  }
}
customElements.define('statusboard-project-list', ProjectList)
