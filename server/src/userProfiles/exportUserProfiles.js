import fs from 'node:fs/promises'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {fileURLToPath} from 'url'
import dayjs from 'dayjs'
import path from 'path'

const serviceAccount = JSON.parse(await fs.readFile('../../keys/coffee-tracker-a75fa-firebase-adminsdk-fbsvc-ad95b78472.json', 'utf8'))

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)
//const dbDev = getFirestore(firebaseApp, 'lpubelts-dev')
const dbProd = getFirestore(firebaseApp)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const backupDir = path.resolve(__dirname, 'backups')
const exportDir = path.resolve(__dirname, 'export')

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    exportUserProfiles().then()
}

async function exportUserProfiles() {

    const userProfileCollection = await dbProd.collection('user-profiles').get()
    const userProfiles = userProfileCollection.docs.map(doc => {
        return {docId: doc.id, ...doc.data()}
    }).sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf())
    const metadata = {
        collection: 'userProfiles',
        date: dayjs().format(),
        docCount: userProfiles.length
    }

    const jsonString = JSON.stringify({metadata, userProfiles}, null, 2)
    const today = dayjs().format('YYYY-MM-DD')

    await fs.writeFile(`${backupDir}/userProfiles.json`, jsonString, function (err) {
        if (err) {
            console.error(err)
        }
    })
    await fs.writeFile(`${backupDir}/userProfiles_${today}.json`, jsonString, function (err) {
        if (err) {
            console.error(err)
        }
    })
    await fs.writeFile(`${exportDir}/userProfiles.json`, jsonString, function (err) {
        if (err) {
            console.error(err)
        }
    })

    return true
}