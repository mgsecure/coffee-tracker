import {localUser, prodUser} from '../../keys/users.js'
import fs from 'fs/promises'

export default async function copyLogFiles() {
    const prodEnvironment = localUser !== process.env.USER
    const sourceDir = prodEnvironment
        ? `/home/${prodUser}/logs/coffee-tracker.com/https`
        : `/Users/${localUser}/Documents/GitHub/coffee-tracker/server/src/apacheLogAnalysis/logsTemp`

    const destinationDir = prodEnvironment
        ? `/home/${prodUser}/coffee-tracker-node/src/apacheLogAnalysis/logs`
        : `/Users/${localUser}/Documents/GitHub/coffee-tracker/server/src/apacheLogAnalysis/logs`

    const allDataFiles = await fs.readdir(sourceDir)
    const accessLogs = allDataFiles.filter(file => (file.match(/^access.(log.\d{4}|log$)/i) && !file.match(/.gz$/i)))
    const errorLogs = allDataFiles.filter(file => (file.match(/^error.(log.\d{4}|log$)/i) && !file.match(/.gz$/i)))

    for (const logFileName of [...accessLogs, ...errorLogs]) {
        await fs.copyFile(`${sourceDir}/${logFileName}`, `${destinationDir}/${logFileName}`)
    }
}