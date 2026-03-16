import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const EFF_URL = 'https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt'
const IT_URL = 'https://raw.githubusercontent.com/ulif/diceware/master/diceware/wordlists/wordlist_it.txt'
const EXPECTED_COUNT = 7776

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const parseWordlist = (rawText) => {
  const lines = rawText.split(/\r?\n/)

  return lines
    .map((line) => line.trim())
    .map((line) => {
      if (!line || line.startsWith('#')) {
        return null
      }

      const numberedMatch = line.match(/^\d{5}\s+(.+)$/)
      const rawWord = numberedMatch ? numberedMatch[1] : line
      const normalized = rawWord.trim().toLowerCase()

      if (!/^[\p{L}][\p{L}'-]*$/u.test(normalized)) {
        return null
      }

      return normalized
    })
    .filter((word) => typeof word === 'string' && word.length > 0)
}

const fetchAndParse = async (url, languageTag) => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`[${languageTag}] HTTP ${response.status} while fetching ${url}`)
  }

  const text = await response.text()
  const words = parseWordlist(text)

  if (words.length < EXPECTED_COUNT) {
    console.error(`[${languageTag}] Expected ${EXPECTED_COUNT} words, got ${words.length}`)
    throw new Error(`[${languageTag}] Invalid word count`)
  }

  if (words.length > EXPECTED_COUNT) {
    console.error(
      `[${languageTag}] Expected ${EXPECTED_COUNT} words, got ${words.length}. Trimming to ${EXPECTED_COUNT}.`,
    )
    return words.slice(0, EXPECTED_COUNT)
  }

  return words
}

const saveJson = async (relativePath, data) => {
  const destination = path.join(__dirname, relativePath)
  await writeFile(destination, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

const main = async () => {
  console.log('Fetching dictionaries...')

  const [englishWords, italianWords] = await Promise.all([
    fetchAndParse(EFF_URL, 'EN'),
    fetchAndParse(IT_URL, 'IT'),
  ])

  await saveJson('public/eff_large_en.json', englishWords)
  await saveJson('public/diceware_it.json', italianWords)

  console.log(`EN words: ${englishWords.length}`)
  console.log(`IT words: ${italianWords.length}`)
  console.log('Dictionary JSON files updated in public/.')
}

main().catch((error) => {
  console.error('Failed to fetch dictionaries:', error)
  process.exitCode = 1
})
