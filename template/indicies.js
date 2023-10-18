'use strict'

module.exports = {
  projects: (data, config, key, { type, project, detail }) => {
    if (!['REPO', 'PACKAGE_JSON', 'PACKUMENT', 'TRAVIS'].includes(type)) {
      return data
    }

    data = data || []
    const existing = data.find((p) => {
      const orgMatches = p.repoOwner === project.repoOwner
      const repoNameMatches = p.repoName === project.repoName
      const repoMatches = p.repo === project.repo
      const packageNameMatches = p.packageName === project.packageName
      return orgMatches && repoNameMatches && repoMatches && packageNameMatches
    })

    const proj = existing || { ...project }
    switch (type) {
      case 'TRAVIS':
        proj.travis = detail
        break
      case 'PACKAGE_JSON':
        proj.packageJson = detail
        break
      case 'REPO':
        proj.repoDetails = detail
        break
      case 'PACKUMENT':
        proj.packument = detail
        break
      default:
        // console.log(`projects: Unknown type '${type}'`)
    }
    // When adding for the first time, unshift it (maintains order),
    // otherwise we are just modifying it in place
    if (!existing) {
      data.unshift(proj)
    }

    return data
  },

  userActivity: (data, config, key, { type, project, detail }) => {
    if (!['ACTIVITY', 'COMMIT'].includes(type)) {
      return data
    }

    data = data || {}
    let user
    const today = new Date()
    let date

    if (type === 'ACTIVITY') {
      date = new Date(detail.createdAt)
      switch (detail.type) {
        case 'IssuesEvent':
          user = detail.payload.issue.user
          break
        case 'PullRequestEvent':
          user = detail.payload.pull_request.user
          break
        case 'IssueCommentEvent':
          user = detail.payload.comment.user
          break
        default:
          return data
      }
    }

    if (type === 'COMMIT') {
      date = new Date(detail.date)
      user = detail.author
    }

    // Only for the lats 90 days
    if (date < today.setDate(today.getDate() - 90)) {
      return data
    }

    if (!user) {
      return data
    }

    data[user.login] = data[user.login] || user
    data[user.login].activityCount = (data[user.login].activityCount || 0) + 1

    return data
  },

  labeledIssues: (data, config, key, { type, project, detail }) => {
    if (type !== 'ISSUE' || detail.state !== 'OPEN') {
      return data
    }

    // label filtering happens in `template/js/index.js`'s fetchIssues method.
    return detail.labels.reduce((labels, label) => {
      labels[label.name] = labels[label.name] || []
      const d = {
        label: label,
        issue: detail,
        project
      }
      labels[label.name].push(d)
      return labels
    }, data || {})
  }
}
