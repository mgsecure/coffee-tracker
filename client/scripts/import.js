import fs from 'fs'
import {parse} from 'csv-parse/sync'
import {
    roasterSchema,
    equipmentSchema,
} from './importSchemas.js'
import fetch from 'node-fetch'
import validate from './importValidate.js'
import {DATA_SHEET_ID} from '../../keys/importKeys.js'
import {fileURLToPath} from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, '/../src/data/')
const serverDataDir = path.join(__dirname, '/../../server/src/data/')

console.log('Starting import...', serverDataDir)

// Helper to load and validate a file
const importValidate = async (tab, schema) => {
    console.log(`Importing ${tab}...`)

    // Download file
    const safeTab = encodeURI(tab)

    const url = `https://docs.google.com/spreadsheets/d/${DATA_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
    const csvData = await (await fetch(url)).text()

    // Parse CSV into JSON
    const data = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    })

    // Validate data before merging in
    validate(data, schema)

    return data
}

const roasterData = await importValidate('Roasters', roasterSchema)
const equipmentData = await importValidate('Equipment', equipmentSchema)



// Load previous JSON for recently updated checks
//const originalData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

// Transform fields into internal JSON format
console.log('Processing main data...')
const jsonData = roasterData
    .map(datum => {
        const id = datum['ID']
        const addedAt = datum['Added At']
        const name = datum.Roaster
        const city = datum.City
        const stateRegion = datum['State/Region']
        const country = datum.Country
        const link = datum.Link
        const pouroverVotes = datum['Pourover Votes']
        const roastfulRanking = datum['Roastful Ranking']
        const source = splitCommaValues(datum.Source)

        const value = {
            id,
            addedAt,
            name,
            city,
            stateRegion,
            country,
            link,
            pouroverVotes,
            roastfulRanking,
            source
        }

        // Clean up empty values to reduce payload size
        Object.keys(value).forEach(key => {
            if (typeof value[key] === 'string' && value[key] === '') value[key] = undefined
            else if (Array.isArray(value[key]) && value[key].length === 0) value[key] = undefined
        })

        return value
    })
    .sort((a, b) => {
        return a.name.localeCompare(b.name)
    })

console.log('Writing roasters.json...')
fs.writeFileSync(`${dataDir}/roasters.json`, JSON.stringify(jsonData, null, 2))
fs.writeFileSync(`${serverDataDir}/roasters.json`, JSON.stringify(jsonData, null, 2))

console.log('Processing equipment data...')
const equipment = equipmentData
    .map(datum => {
        const model = datum['Model']
        const value = {
            id: datum.ID,
            type: datum.Type,
            brand: datum.Brand,
            model: model,
            fullName: (datum.Brand && model)
                ? `${datum.Brand} ${model}`
                : `${datum.Brand || ''}${model || ''}` || '',
        }

        // Clean up empty values to reduce payload size
        Object.keys(value).forEach(key => {
            if (typeof value[key] === 'string' && value[key] === '') value[key] = undefined
            else if (Array.isArray(value[key]) && value[key].length === 0) value[key] = undefined
        })
        return value
    })
    .sort((a, b) => {
        return a.fullName?.localeCompare(b.fullName)
    })

console.log('Writing equipment.json...')
fs.writeFileSync(`${dataDir}/equipment.json`, JSON.stringify(equipment, null, 2))
fs.writeFileSync(`${serverDataDir}/equipment.json`, JSON.stringify(equipment, null, 2))

console.log('Complete.')

function splitCommaValues(string) {
    if (!string) return []
    return string.replace(/\s+,|,\s+/g, ',')
        .split(',')
        .map(s => s.trim())
        .filter(x => x)
}
