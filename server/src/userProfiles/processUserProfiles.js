import fs from 'node:fs/promises'
import {fileURLToPath} from 'url'
import dayjs from 'dayjs'
import path from 'path'
import {setDeep, setDeepAdd, setDeepPush} from '../util/setDeep.js'
import {stateRegionSynonyms, countrySynonyms} from '../data/geoSynonyms.js'
import equipment from '../data/equipment.json' with {type: 'json'}
import {setDeepUnique} from '@starter/client/src/util/setDeep.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const exportDir = path.resolve(__dirname, 'export')

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    processUserProfiles().then()
}

async function processUserProfiles() {

    const machineTypeBrandModels = equipment.reduce((acc, machine) => {
        setDeepUnique(acc, [machine.type, machine.brand], machine.model)
        return acc
    }, {})

    console.log('machineTypeBrandModels', machineTypeBrandModels)

    const userProfileData = JSON.parse(await fs.readFile(`${exportDir}/userProfiles.json`, 'utf8'))

    const userProfileSummary = userProfileData.userProfiles
        .sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf())
        .reduce((acc, profile) => {
            setDeepAdd(acc, ['userCount'], 1)
            setDeepAdd(acc, ['equipmentUserCount'], profile.equipment ? 1 : 0)
            setDeepAdd(acc, ['coffeeUserCount'], profile.coffees ? 1 : 0)
            setDeepAdd(acc, ['brewUserCount'], profile.brews ? 1 : 0)
            setDeepAdd(acc, ['totalEquipmentCount'], profile.equipment?.length || 0)
            setDeepAdd(acc, ['totalCoffeeCount'], profile.coffees?.length || 0)
            setDeepAdd(acc, ['totalBrewsCount'], profile.brews?.length || 0)

            setDeepAdd(acc, ['dailyTotals', dayjs(profile.createdAt).format('YYYY-MM-DD'), 'newUsers'], 1)
            setDeep(acc, ['dailyTotals', dayjs(profile.createdAt).format('YYYY-MM-DD'), 'totalUsers'], acc.userCount)
            setDeep(acc, ['dailyTotals', dayjs(profile.createdAt).format('YYYY-MM-DD'), 'equipmentUsers'], acc.equipmentUserCount)
            setDeep(acc, ['dailyTotals', dayjs(profile.createdAt).format('YYYY-MM-DD'), 'coffeeUsers'], acc.coffeeUserCount)
            setDeep(acc, ['dailyTotals', dayjs(profile.createdAt).format('YYYY-MM-DD'), 'brewUsers'], acc.brewUserCount)
            setDeep(acc, ['dailyTotals28days', dayjs(profile.createdAt).format('YYYY-MM-DD')], acc.dailyTotals[dayjs(profile.createdAt).format('YYYY-MM-DD')])

            profile.equipment?.forEach(equipment => {
                setDeepAdd(acc, ['equipmentTypes', equipment.type], 1)
                setDeepAdd(acc, ['equipment', equipment.type, (equipment.brand), (equipment.model || 'unknown model')], 1)
                if (equipment.altBrand) {
                    setDeepAdd(acc, ['addedEquipmentBrands', (equipment.brand), 'count'], 1)
                    !acc.addedEquipmentBrands[equipment.brand].firstSeen && setDeep(acc, ['addedEquipmentBrands', equipment.brand, 'firstSeen'], equipment.addedAt)
                }
                equipment.altModel && setDeepAdd(acc, ['addedEquipmentBrands', equipment.brand, (equipment.model || 'unknown model')], 1)
            })

            profile.coffees?.forEach(coffee => {
                setDeepAdd(acc, ['coffees', (coffee.roaster?.name || 'unknown roaster'), coffee.name], 1)
                coffee.roastLevel && setDeepAdd(acc, ['coffeeRoasts', coffee.roastLevel], 1)
                coffee.ratings?.rating && setDeepAdd(acc, ['coffeeRating', coffee.ratings.rating], 1)
                coffee.roaster?.name && setDeepAdd(acc, ['coffeeRoasters', coffee.roaster.name], 1)

                // TODO: don't include roasters now in the list
                if (coffee.altRoaster) {
                    setDeepAdd(acc, ['addedCoffeeRoasters', coffee.roaster?.name], 1)
                    coffee.roaster && setDeepPush(acc, ['addedCoffeeRoasterDetails'], coffee.roaster)
                }

                coffee.city && setDeepAdd(acc, ['coffeeCity', coffee.city], 1)
                const canonicalStateRegion = stateRegionSynonyms.find(region => region.synonyms.includes(coffee.stateRegion))?.stateRegion || coffee.stateRegion
                coffee.stateRegion && setDeepAdd(acc, ['coffeeStateRegion', canonicalStateRegion], 1)
                const canonicalCountry = countrySynonyms.find(country => country.synonyms.includes(coffee.country))?.country || coffee.country
                coffee.country && setDeepAdd(acc, ['coffeeCountry', canonicalCountry], 1)

                const price100g = coffee.price && coffee.priceUnit && coffee.weight && coffee.weightUnit
                    ? coffee.weightUnit === 'oz'
                        ? coffee.price / coffee.weight * 28.3495
                        : coffee.price / coffee.weight * 100
                    : undefined
                const pricePound = coffee.price && coffee.priceUnit && coffee.weight && coffee.weightUnit
                    ? coffee.weightUnit === 'oz'
                        ? coffee.price / coffee.weight * 16
                        : coffee.price / coffee.weight * 453.592
                    : undefined
                if (price100g && pricePound) {
                    setDeepAdd(acc, ['coffeePrices',
                        coffee.weightUnit,
                        coffee.weightUnit === 'g'
                            ? Math.round(price100g)
                            : Math.round(pricePound)], 1)
                }


            })

            return acc
        }, {})

    const metadata = {
        collection: 'userProfileSummary',
        date: dayjs().format(),
        profileCount: userProfileData.userProfiles.length
    }

    console.log('userProfileSummary', userProfileSummary)

    const {dailyTotals} = userProfileSummary
    delete userProfileSummary.dailyTotals
    let jsonString = JSON.stringify({metadata, dailyTotals}, null, 2)
    await fs.writeFile(`${exportDir}/userProfileDailyTotals.json`, jsonString, function (err) {
        if (err) {
            console.error(err)
        }
    })

    const {addedCoffeeRoasterDetails: addedCoffeeRoasters} = userProfileSummary
    delete userProfileSummary.addedCoffeeRoasterDetails
    jsonString = JSON.stringify({metadata, addedCoffeeRoasters}, null, 2)
    await fs.writeFile(`${exportDir}/addedCoffeeRoasters.json`, jsonString, function (err) {
        if (err) {
            console.error(err)
        }
    })

    jsonString = JSON.stringify({metadata, userProfileSummary}, null, 2)
    await fs.writeFile(`${exportDir}/userProfileSummary.json`, jsonString, function (err) {
        if (err) {
            console.error(err)
        }
    })


    return true
}
