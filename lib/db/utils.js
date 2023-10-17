/**
 * Get the database key for a specific project.
 *
 * @param {import('../project').Project} project
 * @param {string} type
 */
module.exports.getKeyForProject = function getKeyForProject (project, type) {
  const keys = [
    project.repoOwner,
    project.repoName,
    project.repoBranch,
    project.repoDirectory,
    project.packageName
  ]
  if (type) {
    keys.push(type)
  }

  return keys.join(':')
}
