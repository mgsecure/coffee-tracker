import {localUser, prodUser} from './keys/users.js'
import {CURRENCY_API_KEY} from './keys/importKeys.js'

import fs from 'fs/promises'
import path from 'path'
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const prodEnvironment = localUser !== process.env.USER

console.log(`Running in ${prodEnvironment ? 'production' : 'development'} environment.`, process.env.USER)

export default async function fetchCurrencyConversion() {
    const url = `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/latest/USD`

    const serverDir = prodEnvironment
        ? `/home/${prodUser}/coffee-tracker.com`
        : path.resolve(__dirname, '../public')

    try {
        console.log(`Fetching currency conversion from ${url}...`)
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        const targetFile = path.join(serverDir, 'currencyConversion.json')
        await fs.writeFile(targetFile, JSON.stringify(data, null, 2))
        console.log(`Successfully saved currency conversion to ${targetFile}`)
    } catch (error) {

        console.error('Error fetching or saving currency conversion:', error)
        process.exit(1)
    }
}

// Only run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    fetchCurrencyConversion().then(() => {
        console.log('Done.')
        process.exit(0)
    })
}