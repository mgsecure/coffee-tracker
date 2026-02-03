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
const exportDir = path.resolve(__dirname, 'export')

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    exportSurveySubmissions().then()
}

async function exportSurveySubmissions() {

    const surveySubmissionsCollection = await dbProd.collection('survey-submissions').get()
    const surveySubmissions = surveySubmissionsCollection.docs.map(doc => {
        return {docId: doc.id, ...doc.data()}
    }).sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf())
    const metadata = {
        collection: 'survey-submissions',
        date: dayjs().format(),
        docCount: surveySubmissions.length
    }

    const jsonString = JSON.stringify({metadata, surveySubmissions}, null, 2)

    await fs.writeFile(`${exportDir}/surveySubmissions.json`, jsonString, function (err) {
        if (err) {
            console.error(err)
        }
    })

    return true
}