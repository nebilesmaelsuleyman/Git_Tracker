import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

export class GitServices {
	private repoPath: string
	constructor(repoPath: string) {
		this.repoPath = repoPath
	}

	private async runGit(command: string): Promise<string> {
		try {
			// cwd:tells Node where to run the command from
			//path.resolve ensure the path is absolute,avoiding issues with relative paths
			const { stdout } = await execAsync(command, {
				cwd: path.resolve(this.repoPath),
				windowsHide: true,
			})
			return stdout.trim()
		} catch (error) {
			console.error(`Git command failed:${command}`, error)
			return ''
		}

		// return await execAsync(command, { cwd: path.resolve(this.repoPath) }).then(
		// 	(res) => res.stdout.trim()
		// )
	}

	async getCurrentBranch(): Promise<string> {
		try {
			const branch = await this.runGit('git rev-parse --abbrev-ref HEAD')
			return branch?.trim() || 'unknown'
		} catch (error) {
			console.error('error in accessing branch of the this gitrepo', error)
			return 'failed accesing the branch'
		}
	}
	async getProjectName(): Promise<string> {
		return path.basename(this.repoPath)
	}

	async getLatestCommit(): Promise<{ hash: string; message: string }> {
		try {
			const [hash, message] = await Promise.all([
				this.runGit('git rev-parse HEAD'),
				this.runGit('git log -1 --pretty=%B'),
			])

			return { hash: hash.trim(), message: message.trim() }
		} catch (error) {
			return {
				hash: 'unkown',
				message: 'Failed to get commit',
			}
		}
	}

	async isDirty(): Promise<boolean> {
		try {
			const status = await this.runGit('git status --porcelain')
			return status.length > 0
		} catch (error) {
			console.log('error in checking isDirty', error)
			return false
		}
	}

	async getChangeStats(): Promise<{
		changed: number
		insertions: number
		deletions: number
	}> {
		try {
			const output = await this.runGit('git diff --shortstat')

			const match = output.match(
				/(\d+)\s+files? changed(?:,\s*(\d+)\s+insertions?\(\+\))?(?:,\s*(\d+)\s+deletions?\(-\))?/
			)

			return {
				changed: match?.[1] ? parseInt(match[1]) : 0,
				insertions: match?.[2] ? parseInt(match[2]) : 0,
				deletions: match?.[3] ? parseInt(match[3]) : 0,
			}
		} catch (error) {
			console.error('Error fetching Git diff stats:', error)
			return {
				changed: 0,
				insertions: 0,
				deletions: 0,
			}
		}
	}
}
