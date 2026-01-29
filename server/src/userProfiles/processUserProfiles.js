import fs from 'node:fs/promises'
import {fileURLToPath} from 'url'
import dayjs from 'dayjs'
import path from 'path'
import {setDeepAdd} from '../util/setDeep.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const backupDir = path.resolve(__dirname, 'backups')
const exportDir = path.resolve(__dirname, 'export')

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    processUserProfiles().then()
}

async function processUserProfiles() {

    const userProfileData = JSON.parse(await fs.readFile(`${exportDir}/userProfiles.json`, 'utf8'))

    const userProfileSummary = userProfileData.userProfiles.reduce((acc, profile) => {

        setDeepAdd(acc, ['userCount'], 1)
        setDeepAdd(acc, ['equipmentUserCount'], profile.equipment ? 1 : 0)
        setDeepAdd(acc, ['coffeeUserCount'], profile.coffees ? 1 : 0)
        setDeepAdd(acc, ['brewUserCount'], profile.brews ? 1 : 0)
        setDeepAdd(acc, ['totalEquipmentCount'], profile.equipment?.length || 0)
        setDeepAdd(acc, ['totalCoffeeCount'], profile.coffees?.length || 0)
        setDeepAdd(acc, ['totalBrewsCount'], profile.brews?.length || 0)

        profile.equipment?.forEach(equipment => {
            setDeepAdd(acc, ['equipmentTypes', equipment.type], 1)
            setDeepAdd(acc, ['equipment', equipment.type, (equipment.brand || 'unknown brand'), (equipment.model || 'unknown model')], 1)
            if (equipment.altBrand) setDeepAdd(acc, ['addedEquipmentBrands', equipment.brand, (equipment.model || 'unknown model')],  1)
            if (equipment.altModel) setDeepAdd(acc, ['addedEquipmentBrands', equipment.brand, (equipment.model || 'unknown model')],  1)
        })

        profile.coffees?.forEach(coffee => {
            setDeepAdd(acc, ['coffees', coffee.roaster?.name, coffee.name], 1)
            setDeepAdd(acc, ['coffeeRoasters', coffee.roaster?.name], 1)
            setDeepAdd(acc, ['coffeeRoasts', (coffee.roastLevel || 'unknown')], 1)
            if (coffee.altRoaster) setDeepAdd(acc, ['addedCoffeeRoasters', coffee.roaster?.name],  1)
        })

        return acc
    }, {})

    console.log('userProfileSummary', userProfileSummary)
    return

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
