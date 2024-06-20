import fs from 'fs'
import path from 'path'

const SOURCE_DIRECTORY = 'src'
const EMPTY_SOURCE_DIRECTORY = 'srcDebug'
const EMPTY_SOURCE_FILE = 'EmptySource.ts.txt'
const INCLUDES_DIRECTORY = 'includes'
const ICON_FILE = 'icon.png'

const sourceName = process.argv[2];
const ip = process.argv[3] ?? '192.168.1.150'

if (sourceName === undefined) {
    console.error('Please provide a SourceName as a parameter.')
    process.exit(1)
}

//Delete directory if exist 
if (fs.existsSync(path.join(SOURCE_DIRECTORY, sourceName))) {
    fs.rmSync(path.join(SOURCE_DIRECTORY, sourceName), { recursive: true })
}

// Read the content of emptySource.ts.txt
let emptySourceContent = fs.readFileSync(path.join(EMPTY_SOURCE_DIRECTORY, EMPTY_SOURCE_FILE), 'utf-8')
    .replace(new RegExp(`\\[\\[SourceName\\]\\]`, 'g'), sourceName)
    .replace(new RegExp(`\\[\\[Ip\\]\\]`, 'g'), ip)

// Create directory and write the modified content to the file
fs.mkdirSync(path.join(SOURCE_DIRECTORY, sourceName))
fs.writeFileSync(path.join(SOURCE_DIRECTORY, sourceName, `${sourceName}.ts`), emptySourceContent)

// Create import directory and copy icon.png
fs.mkdirSync(path.join(SOURCE_DIRECTORY, sourceName, INCLUDES_DIRECTORY))
fs.copyFileSync(path.join(EMPTY_SOURCE_DIRECTORY, ICON_FILE), path.join(SOURCE_DIRECTORY, sourceName, INCLUDES_DIRECTORY, ICON_FILE))
