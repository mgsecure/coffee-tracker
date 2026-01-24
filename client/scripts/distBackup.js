import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.resolve(__dirname, '../dist')
const backupDir = path.resolve(__dirname, '../distBackup')

if (fs.existsSync(distDir)) {
  if (fs.existsSync(backupDir)) {
    fs.rmSync(backupDir, { recursive: true, force: true })
  }
  fs.renameSync(distDir, backupDir)
  console.log(`Successfully moved ${distDir} to ${backupDir}`)
} else {
  console.log(`Source directory ${distDir} does not exist.`)
}

