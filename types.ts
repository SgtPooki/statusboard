
type ProjectString = `${string}/${string}`;

interface ProjectObjectBase {
  name?: string
  repo?: ProjectString
  repoBranch?: string
  repoDirectory?: string
  repoName?: string
  repoOwner?: string
  skipNpm?: boolean
}

interface ProjectObject_repo extends ProjectObjectBase{
  repo: ProjectString
}

interface ProjectObject_repoAndOrg extends ProjectObjectBase{
  repoOwner: string
  repoName: string
  repo: undefined
}

type ProjectObject = ProjectObject_repo | ProjectObject_repoAndOrg

export type Project = ProjectObject | ProjectString
