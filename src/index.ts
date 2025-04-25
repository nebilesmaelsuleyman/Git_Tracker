import GitTracker from './git_tracker/TrackProject'
import { GitRepositoryMonitor } from './git_tracker/GitMonitor'
import { GitHistoryStorage } from './DBFile/GitHistoryEntry'
import { PollingManager } from './git_tracker/pollingManager'

// inistantiating Tracker
const tracker = new GitTracker()

function registerProject(projectName: string, path: string) {
	const RegisterRepofiles = tracker.registerProject(projectName, path)

	console.log(RegisterRepofiles ? 'success' : 'failed')
}

function deleteProject(id: string) {
	if (!id) {
		console.error('no id provided')
		return false
	}
	const deleteproject = tracker.deleteProject(id)
	if (!deleteProject) {
		console.log(`no data deleted`)
	} else {
		console.log(`project with id:${id} is deleted succesfully`)
	}
}

async function fetchGitData() {
	const data = new GitHistoryStorage()
	await data.Fetch().then((data) => console.log('githistory data', data))
}

function DeleteGithistory(projectname: string) {
	const updatedData = new GitHistoryStorage()
	updatedData.deleteGitData(projectname)
	console.log(`githistory of project${projectname}is deleted succesfully`)
}

// fetchGitData()
// DeleteGithistory()

//startPolling
PollingManager.start(
	'C:/Users/Administrator/Desktop/Golden-Team/childProcess',
	1000
)
//stop polling
PollingManager.stop('C:/Users/Administrator/Desktop/Golden-Team/childProcess')

//stop all repo palling
// PollingManager.stopAll()
