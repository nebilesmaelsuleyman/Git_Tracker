import { GitServices } from './GitServices'
import { GitHistoryStorage } from '../DBFile/GitHistoryEntry'

export class GitRepositoryMonitor {
	private gitService: GitServices
	private historyStorag: GitHistoryStorage
	private pollingInterval?: NodeJS.Timeout

	constructor(repopath: string, private pollingIntervalMs: number = 500) {
		this.gitService = new GitServices(repopath)
		this.historyStorag = new GitHistoryStorage()
	}
	private async captureSnapshot(): Promise<void> {
		try {
			const [branch, commit, isDirty, changes] = await Promise.all([
				this.gitService.getCurrentBranch(),
				this.gitService.getLatestCommit(),
				this.gitService.isDirty(),
				this.gitService.getChangeStats(),
			])

			const entry = {
				timestamp: new Date().toISOString(),
				branch,
				commitHash: commit.hash,
				commitMessage: commit.message,
				isDirty,
				changedFiles: changes.changed,
				insertions: changes.insertions,
				deletions: changes.deletions,
			}
			await this.historyStorag.saveHistorydata(entry)
			console.log(`Snaphot captured at ${entry.timestamp}`)
		} catch (error) {
			console.error('error capturing snapshot:', error)
		}
	}

	startPolling(): void {
		this.pollingInterval = setInterval(
			() => this.captureSnapshot(),
			this.pollingIntervalMs
		)
		console.log(`started polling repository `)
	}
	stopPolling(): void {
		if (this.pollingInterval) {
			clearInterval(this.pollingInterval)
			console.log('stopped polling')
		}
	}
}
