"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHistoryStorage = void 0;
const path = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
class GitHistoryStorage {
    constructor(storagepath = path.resolve(__dirname, '../data')) {
        this.filepath = path.join(storagepath, 'git_history.json');
        console.log('filepath of githistory', this.filepath);
        this.initializeStorage();
    }
    initializeStorage() {
        if (!fs_1.default.existsSync(this.filepath)) {
<<<<<<< HEAD
            fs_1.default.mkdirSync(path.dirname(this.filepath), { recursive: true });
=======
            fs_1.default.mkdirSync(path.dirname(this.filepath));
>>>>>>> 306fb1ec3e692824bae0b4a73d8b765556800c47
            fs_1.default.writeFileSync(this.filepath, '{}', 'utf-8');
        }
    }
    async saveHistorydata(repoPath, entry) {
        const allHistories = await this.Fetch();
        if (!allHistories[repoPath]) {
            allHistories[repoPath] = [];
        }
<<<<<<< HEAD
        const historykey = allHistories[repoPath];
        const lastEntry = historykey[historykey.length - 1];
        const clean = (data) => {
            const { timestamp, ...rest } = data;
            return rest;
        };
        const isDifferent = !lastEntry ||
            JSON.stringify(clean(entry)) !== JSON.stringify(clean(lastEntry));
        if (isDifferent) {
            historykey.push(entry);
        }
        else {
            lastEntry.timestamp = entry.timestamp;
        }
=======
        allHistories[repoPath].push(entry);
>>>>>>> 306fb1ec3e692824bae0b4a73d8b765556800c47
        fs_1.default.writeFileSync(this.filepath, JSON.stringify(allHistories, null, 2));
    }
    async Fetch() {
        try {
            const data = fs_1.default.readFileSync(this.filepath, 'utf-8');
            if (!data) {
                return {};
            }
<<<<<<< HEAD
            return JSON.parse(data);
=======
            return JSON.parse(data.toString());
>>>>>>> 306fb1ec3e692824bae0b4a73d8b765556800c47
        }
        catch (err) {
            console.error('Error reading history', err);
            return {};
        }
    }
    async deleteGitData(pathname) {
        try {
            const data = fs_1.default.readFileSync(this.filepath);
            const updatedData = data.filter((item) => {
                item.pathname !== pathname;
            });
            fs_1.default.writeFileSync(this.filepath, JSON.stringify(updatedData, null, 2));
        }
        catch (err) { }
    }
}
exports.GitHistoryStorage = GitHistoryStorage;
