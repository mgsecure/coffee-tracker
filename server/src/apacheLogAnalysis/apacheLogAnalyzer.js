#!/usr/bin/env node
'use strict'

// REQUIRED MODULES
import fs from 'fs/promises'
import path from 'path'
import url from 'url'
import {useragent} from 'express-useragent'
import { exec } from 'child_process'
import geoip from 'geoip-lite'

import {localUser, prodUser} from '../../keys/users.js'
const prodEnvironment = localUser !== process.env.USER

// DAYJS SETUP WITH PLUGINS
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

// CONFIGURATION
const filterInternal = false
const daysToReport = 9999

// Date configuration (using YYYYMMDD format)
const startDateStr = '20230220'  // YYYYMMDD
const startDate = dayjs(startDateStr, 'YYYYMMDD')
const today = dayjs()
const endDate = today.subtract(1, 'day')
// You can override endDate if needed

const componentsDir = './'
const logsPath = './logs'
const dataDir = './dailyData'

import countryTZ from './country-timezones.json' with { type: 'json' }
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const ignoreFiles = ['.', '..', '.DS_Store', 'New Folder With Items']

// GLOBAL VARIABLES
let logLines = 0
let stats = {}  // Will be keyed by requestDate (YYYY-MM-DD)
let temp = {}   // Temporary storage for min/max times and IP addresses
let duplicateLockViews = 0 // eslint-disable-line
let duplicateLockViewsByDate = {}

let previousLockViewed = {} // To track duplicate lock views per IP

// READ LOG FILE NAMES
let allLogFiles = await fs.readdir(logsPath)
let logFiles = allLogFiles.filter(file => !ignoreFiles.includes(file)).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
console.log('logFiles:', logFiles)

let crawlerAgents = []
let crawlerAgentNames = {}
// Load crawler agents from both JSON files
getCrawlerUserAgents(path.join(componentsDir, 'crawler-user-agents.json')).then()
getCrawlerUserAgents(path.join(componentsDir, 'crawler-user-agents-LPU.json')).then()

// READ DATA FILE NAMES from dataDir (we only need the date portion from filenames)
let allDataFiles = await fs.readdir(dataDir)
let dataFiles = []
allDataFiles.forEach(file => {
    if (ignoreFiles.includes(file)) return
    let parts = file.split('_')
    if (parts.length > 0) {
        dataFiles.push(parts[0])
    }
})
console.log('dataFiles:', dataFiles)

for (const logFileName of logFiles) {
    await processLogFile(logFileName)
}

writeDailyFiles().then()
console.log(`Data Process Runtime: ${String(dayjs().diff(today, 'minute')).padStart(2, '0')}:${String(dayjs().diff(today, 'second')).padStart(2, '0')}.${String(dayjs().diff(today, 'millisecond')).substring(0,2)}`)
console.log(`Processed ${logLines} log entries`)

async function processLogFile(logFileName) {
    const fullLogPath = path.join(logsPath, logFileName)
    const logContent = await fs.readFile(fullLogPath, 'utf8')
    const lines = logContent.split('\n')

    console.log('processing log file:', fullLogPath, 'with', lines.length, 'lines')

    lines.forEach(line => {
        if (!line.trim()) return
        logLines++
        line = line.replace(/\s+/g, ' ')

        // Parse the line using regex (similar to the Perl capture)
        // Regex: clientAddress rfc1413 username [localTime] "httpRequest" statusCode bytesSent "referer" "clientSoftware"
        const logRegex = /^(\S+) (\S+) (\S+) \[(.+?)\] "(.+?)" (\S+) (\S+) "(.*?)" "(.*?)"/
        const match = logRegex.exec(line)
        if (!match) return

        let [
            _,
            clientAddress,
            _rfc1413,
            _username,
            localTime,
            httpRequest,
            _statusCode,
            _bytesSentToClient,
            referer,
            clientSoftware
        ] = match

        // Filter out specific referers
        // if (referer === 'http://localhost:3000/') return

        if (filterInternal) {
            if (referer === 'https://github.com/NiXXeD/lpu-belt-explorer/blob/main/src/data/data.json' ||
                referer === 'https://github.com/Lockpickers-United/lpu-belt-explorer/blob/main/src/data/data.json' ||
                referer === 'https://images.lpubelts.com/lpubelts-images-by-lock.html' ||
                ['71.105.242.55', '71.247.6.65', '100.37.88.15', '45.48.21.72', '75.168.138.35'].includes(clientAddress)
            ) {
                return
            }
        }

        // Split httpRequest into parts
        const httpParts = httpRequest.split(' ')
        if (httpParts.length < 2) return
        const fileRequested = httpParts[1]

        if (!fileRequested.match(/\/i\//i)) return

        // DATE PROCESSING
        const [datePart, ...timeParts] = localTime.split(':')
        const [requestDay, requestMonth, requestYear] = datePart.split('/')
        const timeString = timeParts.slice(0, 3).join(':')
        const requestDateTimeFull = dayjs(`${requestDay} ${requestMonth} ${requestYear} ${timeString}`, 'DD MMM YYYY HH:mm:ss')
        const requestDateText = `${requestYear}-${('0' + (months.indexOf(requestMonth) + 1)).slice(-2)}-${('0' + requestDay).slice(-2)}`
        const requestDate = dayjs(requestDateText, 'YYYY-MM-DD')

        if (requestDate.isBefore(startDate) || requestDate.isAfter(endDate)) return
        if (today.diff(requestDate, 'day') > daysToReport) return
        if (dataFiles.includes(requestDateText)) return

        // Initialize stats for this date if not already done
        if (!stats[requestDateText]) {
            stats[requestDateText] = { logEntries: 0, date: requestDateText }
            temp[requestDateText] = { ipAddresses: {} }
        }
        stats[requestDateText].logEntries++
        // Update min and max times
        if (!temp[requestDateText].minTime || requestDateTimeFull.isBefore(temp[requestDateText].minTime))
            temp[requestDateText].minTime = requestDateTimeFull
        if (!temp[requestDateText].maxTime || requestDateTimeFull.isAfter(temp[requestDateText].maxTime))
            temp[requestDateText].maxTime = requestDateTimeFull

        // Process crawler agents based on clientSoftware
        if (clientSoftware.match(/google/i) || clientSoftware.match(/ahrefs/i) || clientSoftware.match(/facebookexternalhit/i)) {
            const crawlerName = crawlerAgentNames[clientSoftware] || clientSoftware
            stats[requestDateText].crawlerAgentRequests = stats[requestDateText].crawlerAgentRequests || {}
            stats[requestDateText].crawlerAgentRequests[crawlerName] = (stats[requestDateText].crawlerAgentRequests[crawlerName] || 0) + 1
            return
        }
        if (crawlerAgentNames[clientSoftware]) {
            stats[requestDateText].crawlerAgentRequests = stats[requestDateText].crawlerAgentRequests || {}
            const name = crawlerAgentNames[clientSoftware]
            stats[requestDateText].crawlerAgentRequests[name] = (stats[requestDateText].crawlerAgentRequests[name] || 0) + 1
            return
        }

        // GEOLOOKUP using geoip-lite
        const geo = geoip.lookup(clientAddress)

        // Increment IP counter
        temp[requestDateText].ipAddresses[clientAddress] = (temp[requestDateText].ipAddresses[clientAddress] || 0) + 1

        let requestCountry = geo ? geo.country : 'Unknown'
        let requestState = geo && geo.region ? geo.region : undefined
        // Adjust country names as in Perl code
        if (requestCountry === 'HK') requestCountry = 'Hong Kong'
        if (requestCountry === 'VN') requestCountry = 'Vietnam'
        if (requestCountry === 'KR') requestCountry = 'Republic of Korea'

        stats[requestDateText].continents = stats[requestDateText].continents || {}
        let requestContinent = (countryTZ[requestCountry] && countryTZ[requestCountry][1]) || 'Unknown'
        stats[requestDateText].continents[requestContinent] = (stats[requestDateText].continents[requestContinent] || 0) + 1

        stats[requestDateText].countries = stats[requestDateText].countries || {}
        stats[requestDateText].countries[requestCountry] = (stats[requestDateText].countries[requestCountry] || 0) + 1

        if (requestState && requestCountry === 'US') {
            stats[requestDateText].states = stats[requestDateText].states || {}
            stats[requestDateText].states[requestState] = (stats[requestDateText].states[requestState] || 0) + 1
        }

        // PARSE BEACON REQUESTS
        const parsedUrl = url.parse(fileRequested, true)
        const query = parsedUrl.query
        const trkString = query.trk?.trim()
        const pageString = query.page?.trim()
        const screenWidthString = query.w?.trim()
        const refString = query.ref?.trim()
        const searchTerm = query.search?.trim().toLowerCase()
        let cleanReferrerString = refString ? refString.replace(/(https:\/\/lpubelts\.com\/).*/, '$1').trim() : undefined
        if (cleanReferrerString) {
            stats[requestDateText].referrerViews = stats[requestDateText].referrerViews || {}
            stats[requestDateText].referrerViews[cleanReferrerString] = (stats[requestDateText].referrerViews[cleanReferrerString] || 0) + 1
        }

        // Handle various endpoints based on fileRequested
        if (fileRequested.match(/\/i\/lpu\.gif/i)) {
            stats[requestDateText].beacons = (stats[requestDateText].beacons || 0) + 1
            if (trkString === 'dial') {
                const idMatch = fileRequested.match(/id=([\w\d]+)/)
                const uniqueID = idMatch ? idMatch[1] : ''
                stats[requestDateText].lockViewsById = stats[requestDateText].lockViewsById || {}
                stats[requestDateText].lockViewsById[uniqueID] = (stats[requestDateText].lockViewsById[uniqueID] || 0) + 1
                stats[requestDateText].lockViewsByCountry = stats[requestDateText].lockViewsByCountry || {}
                stats[requestDateText].lockViewsByCountry[requestCountry] = (stats[requestDateText].lockViewsByCountry[requestCountry] || 0) + 1
                stats[requestDateText].lockViewsByWidth = stats[requestDateText].lockViewsByWidth || {}
                stats[requestDateText].lockViewsByWidth[screenWidthString] = (stats[requestDateText].lockViewsByWidth[screenWidthString] || 0) + 1
            } else {
                stats[requestDateText].pageViews = stats[requestDateText].pageViews || {}
                stats[requestDateText].pageViews[trkString] = (stats[requestDateText].pageViews[trkString] || 0) + 1
                stats[requestDateText].pageViews.total = (stats[requestDateText].pageViews.total || 0) + 1
            }
            if (pageString) {
                let cleanPage = pageString.replace(/https:\/\/lpubelts\.com\/\?.*#\/(\w+).*/, '$1')
                if (trkString === 'error') {
                    stats[requestDateText].errorPages = stats[requestDateText].errorPages || {}
                    stats[requestDateText].errorPages[cleanPage] = (stats[requestDateText].errorPages[cleanPage] || 0) + 1
                }
            }
        } else if (fileRequested.match(/\/i\/rafl\.gif\?id=\d{4}-\d{3}/i)) {
            stats[requestDateText].beacons = (stats[requestDateText].beacons || 0) + 1
            const idMatch = fileRequested.match(/id=(\d{4}-\d{3})/)
            const uniqueID = idMatch ? idMatch[1] : ''
            stats[requestDateText].raflPotViewsById = stats[requestDateText].raflPotViewsById || {}
            stats[requestDateText].raflPotViewsById[uniqueID] = (stats[requestDateText].raflPotViewsById[uniqueID] || 0) + 1
            stats[requestDateText].raflPotViewsByCountry = stats[requestDateText].raflPotViewsByCountry || {}
            stats[requestDateText].raflPotViewsByCountry[requestCountry] = (stats[requestDateText].raflPotViewsByCountry[requestCountry] || 0) + 1
            if (cleanReferrerString) {
                stats[requestDateText].referrerPotViews = stats[requestDateText].referrerPotViews || {}
                stats[requestDateText].referrerPotViews[cleanReferrerString] = (stats[requestDateText].referrerPotViews[cleanReferrerString] || 0) + 1
            }
            stats[requestDateText].totalRaflPotViews = (stats[requestDateText].totalRaflPotViews || 0) + 1
        } else if (fileRequested.match(/\/i\/lock\.png\?id=/i)) {
            const idMatch = fileRequested.match(/id=([\w\d]+)/)
            const uniqueID = idMatch ? idMatch[1] : ''
            stats[requestDateText].seoViewsById = stats[requestDateText].seoViewsById || {}
            stats[requestDateText].seoViewsById[uniqueID] = (stats[requestDateText].seoViewsById[uniqueID] || 0) + 1
        } else if (fileRequested.match(/\/i\/clear\.gif/i)) {
            stats[requestDateText].beacons = (stats[requestDateText].beacons || 0) + 1
            const idMatch = fileRequested.match(/id=([\w\d]+)/)
            const uniqueID = idMatch ? idMatch[1] : ''
            stats[requestDateText].lockViewsById = stats[requestDateText].lockViewsById || {}
            stats[requestDateText].lockViewsById[uniqueID] = (stats[requestDateText].lockViewsById[uniqueID] || 0) + 1
            stats[requestDateText].lockViewsByCountry = stats[requestDateText].lockViewsByCountry || {}
            stats[requestDateText].lockViewsByCountry[requestCountry] = (stats[requestDateText].lockViewsByCountry[requestCountry] || 0) + 1
            if (screenWidthString) {
                stats[requestDateText].lockViewsByWidth = stats[requestDateText].lockViewsByWidth || {}
                stats[requestDateText].lockViewsByWidth[screenWidthString] = (stats[requestDateText].lockViewsByWidth[screenWidthString] || 0) + 1
            }
            if (searchTerm && requestDate.isAfter(dayjs('2025-10-30', 'YYYY-MM-DD'))) {
                stats[requestDateText].lockViewsBySearch = stats[requestDateText].lockViewsBySearch || {}
                stats[requestDateText].lockViewsBySearch[searchTerm] = (stats[requestDateText].lockViewsBySearch[searchTerm] || 0) + 1
            }
            stats[requestDateText].lockViewsByIP = stats[requestDateText].lockViewsByIP || {}
            stats[requestDateText].lockViewsByIP[clientAddress] = (stats[requestDateText].lockViewsByIP[clientAddress] || 0) + 1
            if (cleanReferrerString) {
                stats[requestDateText].referrerLockViews = stats[requestDateText].referrerLockViews || {}
                stats[requestDateText].referrerLockViews[cleanReferrerString] = (stats[requestDateText].referrerLockViews[cleanReferrerString] || 0) + 1
            }
        } else if (fileRequested.match(/\/i\/welcome\.gif/i)) {
            stats[requestDateText].beacons = (stats[requestDateText].beacons || 0) + 1
            stats[requestDateText].visits = (stats[requestDateText].visits || 0) + 1
            stats[requestDateText].visitsByCountry = stats[requestDateText].visitsByCountry || {}
            stats[requestDateText].visitsByCountry[requestCountry] = (stats[requestDateText].visitsByCountry[requestCountry] || 0) + 1
            if (cleanReferrerString) {
                stats[requestDateText].referrerWelcomeViews = stats[requestDateText].referrerWelcomeViews || {}
                stats[requestDateText].referrerWelcomeViews[cleanReferrerString] = (stats[requestDateText].referrerWelcomeViews[cleanReferrerString] || 0) + 1
            }
        } else if (fileRequested.match(/\/i\/srch\.gif/i)) {
            if (searchTerm && requestDate.isAfter(dayjs('2025-10-30', 'YYYY-MM-DD'))) {
                stats[requestDateText].completedSearches = stats[requestDateText].completedSearches || {}
                stats[requestDateText].completedSearches[searchTerm] = (stats[requestDateText].completedSearches[searchTerm] || 0) + 1
            }
        }

        // USER AGENT PROCESSING
        let uaResult = useragent.parse(clientSoftware)
        let uaPlatform = uaResult.os || 'Other'
        let uaBrowser = uaResult.browser || 'Other'
        stats[requestDateText].platforms = stats[requestDateText].platforms || {}
        stats[requestDateText].platforms[uaPlatform] = (stats[requestDateText].platforms[uaPlatform] || 0) + 1
        stats[requestDateText].browsers = stats[requestDateText].browsers || {}
        stats[requestDateText].browsers[uaBrowser] = (stats[requestDateText].browsers[uaBrowser] || 0) + 1

        // LOCAL REQUEST TIME ADJUSTMENT
        // Assume server time zone is America/New_York
        const serverTZ = 'America/New_York'
        const serverOffset = dayjs().tz(serverTZ).utcOffset() // in minutes

        if (countryTZ[requestCountry]) {
            let tzName = countryTZ[requestCountry][0] || serverTZ
            let dt = requestDateTimeFull.tz(tzName)
            let localOffset = dayjs().tz(tzName).utcOffset()
            let hourOffset = (localOffset - serverOffset) / 60
            // Add the hour offset to get the adjusted time
            let adjustedDT = dt.add(hourOffset, 'hour')
            let localHour = adjustedDT.format('HH')

            stats[requestDateText].requestsByLocalHour = stats[requestDateText].requestsByLocalHour || {}
            stats[requestDateText].requestsByLocalHour[localHour] = (stats[requestDateText].requestsByLocalHour[localHour] || 0) + 1
            stats[requestDateText].requestsByServerHour = stats[requestDateText].requestsByServerHour || {}
            stats[requestDateText].requestsByServerHour[requestDateTimeFull.format('HH')] = (stats[requestDateText].requestsByServerHour[requestDateTimeFull.format('HH')] || 0) + 1
        }
    })
}


async function writeDailyFiles() {
    Object.keys(temp).forEach(requestDateText => {
        stats[requestDateText].minTime = temp[requestDateText].minTime.format()
        stats[requestDateText].maxTime = temp[requestDateText].maxTime.format()
        stats[requestDateText].visitors = Object.keys(temp[requestDateText].ipAddresses).length
    })

// WRITE JSON OUTPUT FILES per date
    Object.keys(temp).forEach(requestDateText => {
        let minTimeStr = temp[requestDateText].minTime.format('HHmm')
        let maxTimeStr = temp[requestDateText].maxTime.format('HHmm')
        let filename = `${requestDateText}_${minTimeStr}-${maxTimeStr}.json`
        let outputPath = path.join(dataDir, filename)
        fs.writeFile(outputPath, JSON.stringify(stats[requestDateText], null, 2), 'utf8').then()
    })
}




// Optionally, use a system command to announce completion (macOS only)
if (!prodEnvironment) {
    exec("say 'analysis complete'")
}


async function getCrawlerUserAgents(jsonPath) {
    try {
        const data = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
        data.forEach(crawler => {
            crawler.instances.forEach(agent => {
                crawlerAgents.push(agent)
                crawlerAgentNames[agent] = crawler.pattern
            })
        })
    } catch (err) {
        console.error('Error reading crawler user agents from', jsonPath, err)
    }
}
