import fs from 'fs'
import path from 'path'

import { projectDb } from '../DBFile/projectDb'
import { Tproject } from '../type'
import { v4 as uuid4 } from 'uuid'

export default class GitTracker {
	private projectDb: projectDb
	private filepath: string
	private activeProjects: Map<string, Tproject>

	constructor(filepath: string = path.resolve(__dirname, '../data')) {
		this.filepath = filepath
		this.projectDb = new projectDb(filepath)
		this.activeProjects = new Map()
		this.loadProjects()
	}
	// read all projects file and store it in-memory for fast accessing
	private loadProjects(): void {
		this.projectDb.readProjects()?.forEach((project) => {
			this.activeProjects.set(project.id, project)
		})
	}
	public readprojects() {
		const result = this.projectDb.readProjects()
		console.log(result)
	}
	private isValidGitRepo(repoPath: string): boolean {
		try {
			const gitFolder = path.join(repoPath, '.git')
			console.log('this is the repopath to be validated', gitFolder)
			return fs.existsSync(gitFolder) && fs.statSync(gitFolder).isDirectory()
		} catch (error) {
			return false
		}
	}

	registerProject(name: string, repoPath: string): boolean {
		try {
			// auto-correct if someone forgets the backslash after derive letter(c:)

			const absolutePath = path.resolve(repoPath)
			if (!this.isValidGitRepo(absolutePath)) {
				console.error(`invalid Git repository at path :${repoPath}`)
				return false
			}

			const project: Tproject = {
				id: uuid4(),
				name,
				path: repoPath,
				craetedAt: new Date().toISOString(),
			}
			this.projectDb.saveProjects(project)
			this.activeProjects.set(project.id, project)
			return true
		} catch (error) {
			console.error(
				'Registration failed:',
				error instanceof Error ? error.message : error
			)
			return false
		}
	}

	deleteProject(name: string) {
		const projects = this.projectDb.readProjects()

		const newproject = projects?.filter((project) => {
			console.log(project.id)
			return project.name !== name
		})
		console.log(newproject)
		this.projectDb.writeProject(newproject)

		this.activeProjects.delete(name)
		console.log(`project with Id${name} has been deleted`)
	}
}
