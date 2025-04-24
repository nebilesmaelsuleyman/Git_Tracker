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
}
