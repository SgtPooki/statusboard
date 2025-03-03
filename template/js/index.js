'use strict'
/* eslint-disable */
/* eslint-env browser */
require('regenerator-runtime/runtime')
const { html } = require('es5-lit-element')
const { render } = require('es5-lit-html')
const config = window.__config || {}

// Import custom elements
require('./page')
require('./project-list')

// Data fetch middleware
function fetchIssues (opts = {}) {
  let cache
  return async function (req, res, next) {
    const labelFilter = req.query.label
    // Turn the issued into an orderd 2d array of the top three in each group
    const taggedIssues = cache = cache || await (await fetch(`${config.baseUrl}/data/labeledIssues.json`)).json()

    if (opts.all === true) {
      res.locals.issues = Object.entries(taggedIssues).reduce((acc, [tag, issueObjs]) => {
        const issueMap = new Map()
        issueObjs.forEach((issueObj) => {
          if (issueMap.has(issueObj.issue.url)) {
            return
          }
          issueMap.set(issueObj.issue.url, issueObj)
        })
        acc.push([{name: tag}, [...issueMap.values()].slice(0, opts.limit || issueObjs.length)])
        return acc
      }, [])
    } else {
      res.locals.issues = config.issueLabels.reduce((arr, label) => {
        let issues
        Object.entries(taggedIssues).forEach(([tag, i]) => {
          if (issues || label.name !== tag) {
            return
          }
          issues = i
        })
        if (issues && issues.length) {
          const issueMap = new Map()
          issues.forEach((issueObj) => {
            if (issueMap.has(issueObj.issue.url)) {
              return
            }
            issueMap.set(issueObj.issue.url, issueObj)
          })
          arr.push([label, [...issueMap.values()].slice(0, opts.limit || issueObjs.length)])
        }
        return arr
      }, [])
    }
    if (labelFilter) {
      res.locals.issues = res.locals.issues.filter(([tag, _issues]) => {
        return tag.name === labelFilter
      })
    }

    next()
  }
}

require('nighthawk')({
  base: config.baseUrl,
  queryParser: require('querystring').parse
})
  .use((req, res, next) => {
    // Handle the 404 page redirects
    if (req.query && req.query.__path) {
      return res.redirect(req.query.__path)
    }
    next()
  })
  .get('/', fetchIssues({ limit: 5 }), async (req, res) => {
    // Turn user activity into a orderd list of 20
    const userActivity = await (await fetch(`${config.baseUrl}/data/userActivity.json`)).json()
    const u = Object.values(userActivity).sort((v1, v2) => {
      return v1.activityCount < v2.activityCount ? 1 : v1.activityCount === v2.activityCount ? 0 : -1
    }).slice(0, 20)

    render(html`
      <statusboard-page .config="${config}">
        <style>
          main { display: flex; }
          main section { padding: 0 1rem; }
        </style>
        <main>
          <section>
            <h1><a href="${config.baseUrl}/issues">Top Issues</a></h1>

            ${res.locals.issues.map(([tag, issues]) => {
              return html`
                <div class="issues-list">
                  <h3><a href="${config.baseUrl}/issues?label=${tag.name}">${tag.name}</a></h3>
                  <ul>
                    ${issues.map((issue) => {
                      return html`
                          <li>
                            <span class="project-link">
                              <a href="https://www.github.com/${issue.project.repoOwner}" target="_blank">${issue.project.repoOwner}</a>
                              / <a href="https://www.github.com/${issue.project.repo}" target="_blank">${issue.project.repoName}</a>
                            </span>
                            : <a href="${issue.issue.url}" target="_blank">${issue.issue.title}</a>
                          </li>
                      `
                    })}
                  </ul>
                </div>
              `
            })}
          </section>

          <section class="users-list">
            <h1>Top Contributors</h1>
            <ul>
              ${u.map((user) => html`
                <li>
                  <a href="https://www.github.com/${user.login}" target="_blank">
                    <span class="avatar">
                      <img src="${user.avatar_url}" />
                    </span>
                    @${user.login}
                  </a>: ${user.activityCount} contribution
                </li>
              `)}
            </ul>
          </section>
        </main>
      </statusboard-page>
    `, document.body)
  })
  .get('/projects', async () => {
    const projects = await (await fetch(`${config.baseUrl}/data/projects.json`)).json()
    render(html`
      <statusboard-page .config="${config}">
        <statusboard-project-list .projects=${projects} .config="${config}" />
      </statusboard-page>
    `, document.body)
  })
  .get('/issues', fetchIssues({ all: true }), (req, res) => {
    render(html`
      <statusboard-page .config="${config}">
        <main>
          ${res.locals.issues.map(([tag, issues]) => html`
            <section>
              <h1><a href="${config.baseUrl}/issues?label=${tag.name}">${tag.name}</a></h1>
              <div class="issues-list">
                <ul>
                  ${issues.map((issue) => html`
                      <li>
                        <span class="project-link">
                          <a href="https://www.github.com/${issue.project.repoOwner}" target="_blank">${issue.project.repoOwner}</a>
                          / <a href="${issue.project.repo}" target="_blank">${issue.project.repoName}</a>
                        </span>
                        : <a href="${issue.issue.url}" target="_blank">${issue.issue.title}</a>
                      </li>
                  `)}
                </ul>
              </div>
            </section>
          `)}
        </main>
      </statusboard-page>
    `, document.body)
  })
  .listen()
