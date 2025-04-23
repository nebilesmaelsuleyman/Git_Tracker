export interface project {
	id: string
	name: string
	path: string
}

export interface GitData {
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
