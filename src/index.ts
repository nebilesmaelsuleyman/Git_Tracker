import GitTracker from './git_tracker/TrackProject'
import { GitRepositoryMonitor } from './git_tracker/GitMonitor'
import { GitHistoryStorage } from './DBFile/GitHistoryEntry'
import { PollingManager } from './git_tracker/pollingManager'
import { projectDb } from './DBFile/projectDb'

// inistantiating Tracker
const tracker = new GitTracker()
const projectDatabase = new projectDb(
	'C:/Users/Administrator/Desktop/Golden-Team/DBFile'
)

function registerProject(projectName: string, path: string) {
	const RegisterRepofiles = tracker.registerProject(projectName, path)

	console.log(RegisterRepofiles ? 'success' : 'failed')
}
registerProject(
	'pythonScript_writer',
	'C:/Users/Administrator/Desktop/Golden-Team/pythonScript_writer'
)

// read all project from db

const readprojects = tracker.readprojects()

registerProject(
	'Advanced_nodejs',
	'C:/Users/Administrator/Desktop/advanced nodejs/section-4'
)

// read all project from db

// const readprojects = tracker.readprojects()

function deleteProject(name: string) {
	if (!name) {
		console.error('no id provided')
		return false
	}
	const deleteproject = tracker.deleteProject(name)
	if (!deleteProject) {
		console.log(`no data deleted`)
	} else {
		console.log(`project with project name:${name} is deleted succesfully`)
	}
}

//delete project by project name
//deleteProject('')
async function fetchGitData() {
	const data = new GitHistoryStorage()
	await data.Fetch().then((data) => console.log('githistory data', data))
}

function DeleteGithistory(projectname: string) {
	const updatedData = new GitHistoryStorage()
	updatedData.deleteGitData(projectname)
	console.log(`githistory of project${projectname}is deleted succesfully`)
}

fetchGitData()

//startPolling
// PollingManager.start(
// 	'C:/Users/Administrator/Desktop/Golden-Team/childProcess',
// 	100000
// )
PollingManager.start(
	'C:/Users/Administrator/Desktop/Golden-Team/pythonScript_writer',
	1000
)
//stop polling one repo
// PollingManager.stop('./childProcess')

//stop all repo palling
// console.log('stopped all polling')
// PollingManager.stopAll()

//deleting githistory data
// DeleteGithistory('childProcess')
// console.log(`git history of childproces deleted`)
