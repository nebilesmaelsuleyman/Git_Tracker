import { GitServices } from './GitServices'
import * as path from 'path'

export async function getRepoStatus(repoPath: string) {
	const service = new GitServices(repoPath)

	const [branch, { hash, message }, isDirty, stats] = await Promise.all([
		service.getCurrentBranch(),
		service.getLatestCommit(),
		service.isDirty(),
		service.getChangeStats(),
	])
	return {
		name: path.basename(repoPath),
		branch,
		commit: hash,
		message,
		isDirty,
		...stats,
	}
}
