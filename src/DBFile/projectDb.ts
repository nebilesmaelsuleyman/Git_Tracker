import fs from 'fs'
import path from 'node:path'

import { project } from '../type'

export class projectDb {
	private readonly project_File: string
	constructor(filepath: string) {
		this.project_File = path.join(filepath, 'projects.json')
		if (!fs.existsSync(this.project_File)) {
			fs.writeFileSync(this.project_File, '[]')
		}
	}
	readProjects(): project[] | undefined {
		try {
			const data = fs.readFileSync(this.project_File, 'utf-8')
			return JSON.parse(data) as project[]
		} catch (error) {
			console.error('Error reading projects file:', error)
			return undefined
		}
	}
	RegisterProject(projects: project[]): void {
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
			this.RegisterProject(newProjects)
			return true
		}
		return false
	}
	saveProjects(project: project): void {
		const projects = this.readProjects()
		projects?.push(project)
		if (projects) {
			this.RegisterProject(projects)
		} else {
			console.error('Error: Cannot save project as projects list is undefined.')
		}
	}
}
