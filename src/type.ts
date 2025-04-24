export interface Tproject {
	id: string
	name: string
	path: string
	craetedAt: string
}

export interface TGitData {
	projectId: string
	branch: string
	commit: string
	message: string
	isDirty: boolean
	changedFiles: number
	insertions: number
	deletions: number
	timestamp: string
}

export interface TGitHistoryEntry {
	timestamp: string
	branch: string
	commitHash: string
	commitMessage: string
	isDirty: boolean
	changedFiles: number
	insertions: number
	deletions: number
}
