import { TGitHistoryEntry } from '../type'
import * as path from 'path'
import fs from 'fs'
export class GitHistoryStorage {
	private readonly filepath: string
	constructor(storagepath: string = path.resolve(__dirname, '../data')) {
		this.filepath = path.join(storagepath, 'git_history.json')
		console.log('filepath of githistory', this.filepath)
		this.initializeStorage()
	}

	private initializeStorage(): void {
		if (!fs.existsSync(this.filepath)) {
			fs.mkdirSync(path.dirname(this.filepath))
			fs.writeFileSync(this.filepath, '{}', 'utf-8')
		}
	}

	async saveHistorydata(repoPath: string, entry: TGitHistoryEntry) {
		const allHistories: { [key: string]: TGitHistoryEntry[] } =
			await this.Fetch()

		if (!allHistories[repoPath]) {
			allHistories[repoPath] = []
		}

		allHistories[repoPath].push(entry)

		fs.writeFileSync(this.filepath, JSON.stringify(allHistories, null, 2))
	}

	async Fetch(): Promise<{ [key: string]: TGitHistoryEntry[] }> {
		try {
			const data = fs.readFileSync(this.filepath, 'utf-8')
			if (!data) {
				return {}
			}
			return JSON.parse(data.toString()) as {
				[key: string]: TGitHistoryEntry[]
			}
		} catch (err) {
			console.error('Error reading history', err)
			return {}
		}
	}

	async deleteGitData(pathname: string) {
		try {
			const data = fs.readFileSync(this.filepath)
			const updatedData = data.filter((item: any) => {
				item.pathname !== pathname
			})
			fs.writeFileSync(this.filepath, JSON.stringify(updatedData, null, 2))
		} catch (err) {}
	}
}
