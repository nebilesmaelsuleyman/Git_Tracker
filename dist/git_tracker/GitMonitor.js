"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitRepositoryMonitor = void 0;
const GitServices_1 = require("./GitServices");
const GitHistoryEntry_1 = require("../DBFile/GitHistoryEntry");
class GitRepositoryMonitor {
    constructor(repopath, pollingIntervalMs = 100000) {
        this.pollingIntervalMs = pollingIntervalMs;
        this.isPolling = false;
        this.repopath = repopath;
        this.gitService = new GitServices_1.GitServices(repopath);
        this.historyStorag = new GitHistoryEntry_1.GitHistoryStorage();
    }
    async captureSnapshot() {
        try {
            const [branch, commit, isDirty, changes, projectName] = await Promise.all([
                this.gitService.getCurrentBranch(),
                this.gitService.getLatestCommit(),
                this.gitService.isDirty(),
                this.gitService.getChangeStats(),
                this.gitService.getProjectName(),
            ]);
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
            };
            console.log(`Snaphot captured at ${entry.timestamp}`);
            await this.historyStorag.saveHistorydata(this.repopath, entry);
        }
        catch (error) {
            console.error('error capturing snapshot:', error);
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
    async startPolling() {
        if (this.isPolling) {
            console.log('polling is already active.');
            return;
        }
        this.isPolling = true;
        console.log('started polling repository ...');
        const poll = async () => {
            if (!this.isPolling)
                return;
            try {
                await this.captureSnapshot();
            }
            catch (error) {
                console.error('Error during snapshot capture', error);
            }
            setTimeout(poll, this.pollingIntervalMs);
        };
        poll();
    }
    stopPolling() {
        this.isPolling = false;
        console.log('stopped polling repository');
    }
}
exports.GitRepositoryMonitor = GitRepositoryMonitor;
