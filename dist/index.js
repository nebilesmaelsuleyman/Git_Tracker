'use strict'
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
const TrackProject_1 = __importDefault(require('./git_tracker/TrackProject'))
const GitHistoryEntry_1 = require('./DBFile/GitHistoryEntry')

const pollingManager_1 = require('./git_tracker/pollingManager')
// inistantiating Tracker
const tracker = new TrackProject_1.default()

function registerProject(projectName, path) {
	const RegisterRepofiles = tracker.registerProject(projectName, path)
	console.log(RegisterRepofiles ? 'success' : 'failed')
}

registerProject(
	'Advanced_nodejs',
	'C:/Users/Administrator/Desktop/advanced nodejs/section-4'
)
// read all project from db
// const readprojects = tracker.readprojects()
function deleteProject(name) {
	if (!name) {
		console.error('no id provided')
		return false
	}
	const deleteproject = tracker.deleteProject(name)

	registerProject(
		'pythonScript_writer',
		'C:/Users/Administrator/Desktop/Golden-Team/pythonScript_writer'
	)
	const readprojects = tracker.readprojects()
	function deleteProject(id) {
		if (!id) {
			console.error('no id provided')
			return false
		}
		const deleteproject = tracker.deleteProject(id)

		if (!deleteProject) {
			console.log(`no data deleted`)
		} else {
			console.log(`project with project name:${name} is deleted succesfully`)
		}
	}
	//delete project by project name
	//deleteProject('')

	console.log(`project with id:${id} is deleted succesfully`)
}

async function fetchGitData() {
	const data = new GitHistoryEntry_1.GitHistoryStorage()
	await data.Fetch().then((data) => console.log('githistory data', data))
}
function DeleteGithistory(projectname) {
	const updatedData = new GitHistoryEntry_1.GitHistoryStorage()
	updatedData.deleteGitData(projectname)
	console.log(`githistory of project${projectname}is deleted succesfully`)
}

fetchGitData()
// startPolling
// PollingManager.start('./childProcess', 100000)
pollingManager_1.PollingManager.start(
	'C:/Users/Administrator/Desktop/advanced nodejs/section-4'
)
//stop polling one repo
// PollingManager.stop('./childProcess')

//stop all repo palling
// console.log('stopped all polling')
// PollingManager.stopAll()
//deleting githistory data
// DeleteGithistory('childProcess')
// console.log(`git history of childproces deleted`)
