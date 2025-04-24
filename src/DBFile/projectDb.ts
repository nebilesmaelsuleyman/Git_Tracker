import fs from 'fs'
import path from 'node:path'

import { Tproject } from '../type'

export class projectDb {
	private lastid: number = 0
	private readonly project_File: string
	constructor(filepath: string) {
		this.project_File = path.join(filepath, 'projects.json')
		// sure the data folder exists
		fs.mkdirSync(filepath, { recursive: true })
		console.log('file path from db', this.project_File)
		if (!fs.existsSync(this.project_File)) {
			fs.writeFileSync(this.project_File, '[]')
		}
		this.initializedLastId()
	}

	private initializedLastId(): void {
		const projects = this.readProjects()
		this.lastid =
			projects?.reduce((maxId, project) => {
				const currentId = parseInt(project.id, 10)
				return currentId > maxId ? currentId : maxId
			}, 0) || 0
	}

	public getNextId(): string {
		this.lastid++
		return this.lastid.toString()
	}

	readProjects(): Tproject[] {
		try {
			const data = fs.readFileSync(this.project_File, 'utf-8')
			return JSON.parse(data) as Tproject[]
		} catch (error) {
			console.error('Error reading projects file:', error)
			return []
		}
	}
	writeProject(projects: Tproject[]): void {
		try {
			fs.writeFileSync(this.project_File, JSON.stringify(projects, null, 2))
		} catch (error) {
			console.error('Error writing projects file:', error)
			throw error
		}
	}
	deleteProject(projectId: string): boolean {
		const projects = this.readProjects()
		if (!projects) {
			return false
		}
		const newProjects = projects.filter((project) => {
			project.id !== projectId
		})

		if (newProjects.length !== projects.length) {
			this.writeProject(newProjects)
			return true
		}
		return false
	}
	saveProjects(project: Tproject): void {
		const projects = this.readProjects()
		projects?.push(project)
		if (projects) {
			this.writeProject(projects)
		} else {
			console.error('Error: Cannot save project as projects list is undefined.')
		}
	}
}
