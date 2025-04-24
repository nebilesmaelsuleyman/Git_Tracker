import GitTracker from './git_tracker/TrackProject'

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

registerProject(
	'child_process',
	'C:/Users/Administrator/Desktop/Golden-Team/Git_Tracker'
)
deleteProject('3')
