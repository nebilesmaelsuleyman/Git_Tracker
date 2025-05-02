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
		const dir = path.dirname(this.filepath)

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}

		if (!fs.existsSync(this.filepath)) {
			fs.writeFileSync(this.filepath, '{}', 'utf-8')
		}
	}

	async saveHistorydata(repoPath: string, entry: TGitHistoryEntry) {
		const allHistories: { [key: string]: TGitHistoryEntry[] } =
			await this.Fetch()

		if (!allHistories[repoPath]) {
			allHistories[repoPath] = []
		}
		const historykey = allHistories[repoPath]
		const lastEntry = historykey[historykey.length - 1]

		const clean = (data: TGitHistoryEntry) => {
			const { timestamp, ...rest } = data
			return rest
		}

		const isDifferent =
			!lastEntry ||
			JSON.stringify(clean(entry)) !== JSON.stringify(clean(lastEntry))

		if (isDifferent) {
			historykey.push(entry)
		} else {
			lastEntry.timestamp = entry.timestamp
		}

		fs.writeFileSync(this.filepath, JSON.stringify(allHistories, null, 2))
	}

	async Fetch(): Promise<{ [key: string]: TGitHistoryEntry[] }> {
		try {
			const data = fs.readFileSync(this.filepath, 'utf-8')
			if (!data) {
				return {}
			}
			return JSON.parse(data) as {
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
