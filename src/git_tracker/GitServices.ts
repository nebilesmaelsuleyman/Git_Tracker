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
		return await execAsync(command, { cwd: path.resolve(this.repoPath) }).then(
			(res) => res.stdout.trim()
		)
	}

	async getCurrentBranch(): Promise<string> {
		return this.runGit('git rev-parse --abbrev-ref HEAD')
	}

	async getLatestCommit(): Promise<{ hash: string; message: string }> {
		const log = await this.runGit('git log -1 --pretty=format:%H|%s')
		const [hash, ...msgpart] = log.split('|')
		return { hash, message: msgpart.join('|') }
	}

	async isDirty(): Promise<boolean> {
		const status = await this.runGit('git status --porcelain')
		return status.length > 0
	}

	async getChangeStats(): Promise<{
		changed: number
		insertions: number
		deletions: number
	}> {
		const output = await this.runGit('git diff --shortstat')
		const match = output.match(
			/(\d+)\s+files? changed(?:,\s*(\d+)\s+insertions?\(\+\))?(?:,\s*(\d+)\s+deletions?\(-\))?/
		)
		return {
			changed: match?.[1] ? parseInt(match[1]) : 0,
			insertions: match?.[2] ? parseInt(match[2]) : 0,
			deletions: match?.[3] ? parseInt(match[3]) : 0,
		}
	}
}
