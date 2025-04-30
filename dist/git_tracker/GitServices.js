"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitServices = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
const program = new commander_1.Command();
class GitServices {
    constructor(repoPath) {
        this.repoPath = repoPath;
    }
    async runGit(command) {
        try {
            const { stdout, stderr } = await execAsync(command, {
                cwd: this.repoPath,
                shell: true,
            });
            if (stderr)
                console.error('git error', stderr);
            return stdout.toString().trim();
        }
        catch (error) {
            console.error('Error executing git command:', error);
            return '';
        }
    }
    async getCurrentBranch() {
        try {
            const branch = await this.runGit('git rev-parse --abbrev-ref HEAD');
            return branch?.trim() || 'unknown';
        }
        catch (error) {
            console.error('error in accessing branch of the this gitrepo', error);
            return 'failed accesing the branch';
        }
    }
    async getProjectName() {
        return path_1.default.basename(this.repoPath);
    }
    async getLatestCommit() {
        try {
            const [hash, message] = await Promise.all([
                this.runGit('git rev-parse HEAD'),
                this.runGit('git log -1 --pretty=%B'),
            ]);
            return { hash: hash.trim(), message: message.trim() };
        }
        catch (error) {
            return {
                hash: 'unkown',
                message: 'Failed to get commit',
            };
        }
    }
    async isDirty() {
        try {
            const status = await this.runGit('git status --porcelain');
            return status.length > 0;
        }
        catch (error) {
            console.log('error in checking isDirty', error);
            return false;
        }
    }
    async getChangeStats() {
        try {
            const output = await this.runGit('git diff --shortstat');
            const match = output.match(/(\d+)\s+files? changed(?:,\s*(\d+)\s+insertions?\(\+\))?(?:,\s*(\d+)\s+deletions?\(-\))?/);
            return {
                changed: match?.[1] ? parseInt(match[1]) : 0,
                insertions: match?.[2] ? parseInt(match[2]) : 0,
                deletions: match?.[3] ? parseInt(match[3]) : 0,
            };
        }
        catch (error) {
            console.error('Error fetching Git diff stats:', error);
            return {
                changed: 0,
                insertions: 0,
                deletions: 0,
            };
        }
    }
}
exports.GitServices = GitServices;
