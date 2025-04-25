import { GitRepositoryMonitor } from './GitMonitor'

export class PollingManager {
	private static monitors = new Map<string, GitRepositoryMonitor>()

	static start(path: string, intervalMs?: number) {
		if (this.monitors.has(path)) {
			console.log(`polling already active for path:${path}`)
			return
		}
		const monitor = new GitRepositoryMonitor(path, intervalMs)
		this.monitors.set(path, monitor)
		monitor.startPolling()
	}

	static stop(path: string) {
		const monitor = this.monitors.get(path)
		if (!monitor) {
			console.log(`No active polling found for :${path}`)
			return
		}
		monitor.stopPolling()
		this.monitors.delete(path)
	}

	static stopAll() {
		this.monitors.forEach((monitor, path) => {
			monitor.stopPolling()
			// this.monitors.delete(path)
		})
	}
}
