"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const projectDb_1 = require("../DBFile/projectDb");
class GitTracker {
    constructor(filepath = path_1.default.resolve(__dirname, '../data')) {
        this.filepath = filepath;
        this.projectDb = new projectDb_1.projectDb(filepath);
        this.activeProjects = new Map();
        this.loadProjects();
    }
    // read all projects file and store it in-memory for fast accessing
    loadProjects() {
        this.projectDb.readProjects()?.forEach((project) => {
            this.activeProjects.set(project.id, project);
        });
    }
    readprojects() {
        const result = this.projectDb.readProjects();
        console.log(result);
    }
    isValidGitRepo(repoPath) {
        try {
            const gitFolder = path_1.default.join(repoPath, '.git');
            console.log('this is the repopath to be validated', gitFolder);
            return fs_1.default.existsSync(gitFolder) && fs_1.default.statSync(gitFolder).isDirectory();
        }
        catch (error) {
            return false;
        }
    }
    registerProject(name, repoPath) {
        try {
            // auto-correct if someone forgets the backslash after derive letter(c:)
            if (/^([a-zA-Z]):[^\\/]/.test(repoPath)) {
                repoPath = repoPath.replace(/^([a-zA-Z]):/, '$1:/');
            }
            const absolutePath = path_1.default.resolve(repoPath);
            if (!this.isValidGitRepo(absolutePath)) {
                console.error(`invalid Git repository at path :${repoPath}`);
                return false;
            }
            const project = {
                id: this.projectDb.getNextId(),
                name,
                path: repoPath,
                craetedAt: new Date().toISOString(),
            };
            this.projectDb.saveProjects(project);
            this.activeProjects.set(project.id, project);
            return true;
        }
        catch (error) {
            console.error('Registration failed:', error instanceof Error ? error.message : error);
            return false;
        }
    }
    deleteProject(id) {
        const projects = this.projectDb.readProjects();
        const newproject = projects?.filter((project) => {
            console.log(project.id);
            return project.id !== id;
        });
        console.log(newproject);
        this.projectDb.writeProject(newproject);
        this.activeProjects.delete(id);
        console.log(`project with Id${id} has been deleted`);
    }
}
exports.default = GitTracker;
