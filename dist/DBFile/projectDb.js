"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectDb = void 0;
const fs_1 = __importDefault(require("fs"));
const node_path_1 = __importDefault(require("node:path"));
class projectDb {
    constructor(filepath) {
        this.lastid = 0;
        this.project_File = node_path_1.default.join(filepath, 'projects.json');
        // sure the data folder exists
        fs_1.default.mkdirSync(filepath, { recursive: true });
        console.log('file path from db', this.project_File);
        if (!fs_1.default.existsSync(this.project_File)) {
            fs_1.default.writeFileSync(this.project_File, '[]');
        }
        this.initializedLastId();
    }
    initializedLastId() {
        const projects = this.readProjects();
        this.lastid =
            projects?.reduce((maxId, project) => {
                const currentId = parseInt(project.id, 10);
                return currentId > maxId ? currentId : maxId;
            }, 0) || 0;
    }
    getNextId() {
        this.lastid++;
        return this.lastid.toString();
    }
    readProjects() {
        try {
            const data = fs_1.default.readFileSync(this.project_File, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading projects file:', error);
            return [];
        }
    }
    writeProject(projects) {
        try {
            fs_1.default.writeFileSync(this.project_File, JSON.stringify(projects, null, 2));
        }
        catch (error) {
            console.error('Error writing projects file:', error);
            throw error;
        }
    }
    deleteProject(projectId) {
        const projects = this.readProjects();
        if (!projects) {
            return false;
        }
        const newProjects = projects.filter((project) => {
            project.id !== projectId;
        });
        if (newProjects.length !== projects.length) {
            this.writeProject(newProjects);
            return true;
        }
        return false;
    }
    saveProjects(project) {
        const projects = this.readProjects();
        projects?.push(project);
        if (projects) {
            this.writeProject(projects);
        }
        else {
            console.error('Error: Cannot save project as projects list is undefined.');
        }
    }
}
exports.projectDb = projectDb;
