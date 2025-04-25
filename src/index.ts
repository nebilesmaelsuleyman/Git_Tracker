import GitTracker from './git_tracker/TrackProject'
import { GitRepositoryMonitor } from './git_tracker/GitMonitor'
import { GitHistoryStorage } from './DBFile/GitHistoryEntry'

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

function MonitorandPoll(path: string, time?: number) {
	const monitor = new GitRepositoryMonitor(path, time)
	monitor.startPolling()
}
function stopPolling(path: string) {
	const monitor = new GitRepositoryMonitor(path)
	monitor.stopPolling()
}

function DeleteGithistory(projectname: string) {
	const updatedData = new GitHistoryStorage()
	updatedData.deleteGitData(projectname)
	console.log(`githistory of project${projectname}is deleted succesfully`)
}

fetchGitData()
// DeleteGithistory()
MonitorandPoll('C:/Users/Administrator/Desktop/Golden-Team/childProcess', 1000)

// start Monitoring
// const monitor = new GitRepositoryMonitor(
// 	'C:/Users/Administrator/Desktop/Golden-Team/childProcess',
// 	500
// )

// monitor.startPolling()
// console.log('Tracking')

// console.log('stop capturing')
// registerProject(
// 	'child_process',
// 	'C:/Users/Administrator/Desktop/Golden-Team/Git_Tracker'
// )
// deleteProject('3')
