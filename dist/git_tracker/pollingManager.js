"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollingManager = void 0;
const GitMonitor_1 = require("./GitMonitor");
class PollingManager {
    static start(path, intervalMs) {
        if (this.monitors.has(path)) {
            console.log(`polling already active for path:${path}`);
            return;
        }
        const monitor = new GitMonitor_1.GitRepositoryMonitor(path, intervalMs);
        this.monitors.set(path, monitor);
        monitor.startPolling();
    }
    static stop(path) {
        const monitor = this.monitors.get(path);
        if (!monitor) {
            console.log(`No active polling found for :${path}`);
            return;
        }
        monitor.stopPolling();
        this.monitors.delete(path);
    }
    static stopAll() {
        this.monitors.forEach((monitor, path) => {
            monitor.stopPolling();
            // this.monitors.delete(path)
        });
    }
}
exports.PollingManager = PollingManager;
PollingManager.monitors = new Map();
