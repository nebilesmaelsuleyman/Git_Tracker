import GitTracker from './git_tracker/gitTracker'

// inistantiating Tracker
const tracker = new GitTracker()

const RegisterRepofiles = tracker.registerProject(
	'child_process',
	'C:/Users/Administrator/Desktop/Golden-Team/Git_Tracker'
)
console.log(RegisterRepofiles ? 'success' : 'failed')
