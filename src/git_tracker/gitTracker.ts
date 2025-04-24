import fs from 'fs'
import path from 'path'

import { projectDb } from '../DBFile/projectDb'
import { Tproject } from '../type'

export default class GitTracker {
	private projectDb: projectDb
	private activeProjects: Map<string, Tproject>

	constructor(filepath: string = '../data') {
		this.projectDb = new projectDb(filepath)
		this.activeProjects = new Map()
		this.loadProjects
	}
	private loadProjects(): void {
		this.projectDb.readProjects()?.forEach((project) => {
			this.activeProjects.set(project.id, project)
		})
	}

	private isValidGitRepo(repoPath: string): boolean {
		try {
			const gitpath = path.join(repoPath, '.git')
			return fs.existsSync(gitpath) && fs.statSync(gitpath).isDirectory()
		} catch (error) {
			return false
		}
	}

	registerProject(name: string, repoPath: string): boolean {
		try {
			const nomrmalizedPath = path.normalize(repoPath)
			if (!this.isValidGitRepo(nomrmalizedPath)) {
				console.error(`invalid Git repository at path :${repoPath}`)
				return false
			}

			const project: Tproject = {
				id: this.projectDb.getNextId(),
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
}
