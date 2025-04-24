import { TGitHistoryEntry } from '../type'
import * as path from 'path'
import fs from 'fs'
export class GitHistoryStorage {
	private readonly filepath: string
	constructor(storagepath: string = path.resolve(__dirname, './data')) {
		this.filepath = path.join(storagepath, 'git_history.json')
		console.log('filepath of githistory', this.filepath)
		this.initializeStorage()
	}

	private initializeStorage(): void {
		if (!fs.existsSync(this.filepath)) {
			fs.mkdirSync(path.dirname(this.filepath), { recursive: true })
			fs.writeFileSync(this.filepath, '[]', 'utf-8')
		}
	}

	async saveHistorydata(entry: TGitHistoryEntry) {
		const history = await this.readAll()
		history?.push(entry)
		fs.writeFileSync(this.filepath, JSON.stringify(history, null, 2))
	}

	async readAll(): Promise<TGitHistoryEntry[]> {
		try {
			const data = fs.readFileSync(this.filepath)
			return JSON.parse(data.toString())
		} catch (err) {
			console.error('Error reading history', err)
			return []
		}
	}
}
