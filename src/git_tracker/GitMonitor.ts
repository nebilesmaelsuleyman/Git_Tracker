import { GitServices } from './GitServices'
import { GitHistoryStorage } from '../DBFile/GitHistoryEntry'

export class GitRepositoryMonitor {
	private gitService: GitServices
	private historyStorag: GitHistoryStorage
	private pollingInterval?: NodeJS.Timeout
	private isPolling = false
	private repopath: string

	constructor(repopath: string, private pollingIntervalMs: number = 100000) {
		this.repopath = repopath
		this.gitService = new GitServices(repopath)
		this.historyStorag = new GitHistoryStorage()
	}

	private async captureSnapshot(): Promise<void> {
		try {
			const [branch, commit, isDirty, changes, projectName] = await Promise.all(
				[
					this.gitService.getCurrentBranch(),
					this.gitService.getLatestCommit(),
					this.gitService.isDirty(),
					this.gitService.getChangeStats(),
					this.gitService.getProjectName(),
				]
			)

			const entry = {
				projectName,
				branch,
				commitHash: commit.hash,
				commitMessage: commit.message,
				isDirty,
				changedFiles: changes.changed,
				insertions: changes.insertions,
				deletions: changes.deletions,
				timestamp: new Date().toISOString(),
			}
			console.log(`Snaphot captured at ${entry.timestamp}`)
			await this.historyStorag.saveHistorydata(this.repopath, entry)
		} catch (error) {
			console.error('error capturing snapshot:', error)
		}
	}

	// startPolling(): void {
	// 	if (this.isPolling) {
	// 		console.warn('polling already in progress')
	// 		return
	// 	}
	// 	this.isPolling = true
	// 	this.pollingInterval = setTimeout(async () => {
	// 		try {
	// 			await this.captureSnapshot()
	// 		} catch (error) {
	// 			console.error('Failded to capture snapshot:', error)
	// 		}
	// 	}, this.pollingIntervalMs)
	// 	console.log('started polling repository')
	// }

	async startPolling(): Promise<void> {
		if (this.isPolling) {
			console.log('polling is already active.')
			return
		}

		this.isPolling = true
		console.log('started polling repository ...')

		const poll = async () => {
			if (!this.isPolling) return

			try {
				await this.captureSnapshot()
			} catch (error) {
				console.error('Error during snapshot capture', error)
			}
			setTimeout(poll, this.pollingIntervalMs)
		}
		poll()
	}

	stopPolling(): void {
		this.isPolling = false
		console.log('stopped polling repository')
	}
}
