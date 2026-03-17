import { computed, ref, watch } from 'vue'

const BITS_PER_WORD = 12.92
const WORDLIST_SIZE = 7776
const RTX_5090_HASH_RATE = 150_000_000_000
const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600
const SECONDS_PER_DAY = 86400
const SECONDS_PER_YEAR = 31_557_600
const UNIVERSE_AGE_YEARS = 13_800_000_000
const DICTIONARY_PATHS = {
  en: `${import.meta.env.BASE_URL}eff_large_en.json`,
  it: `${import.meta.env.BASE_URL}diceware_it.json`,
}
const UI_TRANSLATIONS = {
  en: {
    preTitle: 'SECURE GENERATOR',
    themeSwitchToLight: 'Switch to Light',
    themeSwitchToDark: 'Switch to Dark',
    controlsTitle: 'Generation Controls',
    controlsDescription: 'Choose language, separator, and number of words.',
    labelLanguage: 'Language',
    labelSeparator: 'Separator',
    labelRequirements: 'REQUIREMENTS',
    labelWords: 'Words',
    separatorSpace: 'space',
    toggleCapitalizeWords: 'Capitalize Words',
    toggleIncludeNumbers: 'Include Numbers',
    generatePassphrase: 'Generate Passphrase',
    loadingDictionary: 'Loading Dictionary...',
    loadingHint: 'Loading words, generation is temporarily disabled.',
    passphraseTitle: 'Your Passphrase',
    entropyLabel: (bits) => `Entropy: ${bits} bits`,
    securityEvaluation: 'Security Evaluation',
    bruteForceLabel: 'Estimated brute-force time (RTX 5090 @ 150 GH/s)',
    copyToClipboard: 'Copy to Clipboard',
    copied: 'Copied!',
    readyToCopy: 'Ready to copy',
    showPassphrase: 'Show passphrase',
    hidePassphrase: 'Hide passphrase',
    languageNames: {
      en: 'English',
      it: 'Italiano',
    },
    securityLevels: {
      weak: {
        label: 'Weak',
        description: 'Can be cracked in hours or days by specialized hardware.',
      },
      medium: {
        label: 'Medium',
        description: 'Requires months or years, acceptable for non-critical services.',
      },
      strong: {
        label: 'Strong',
        description: 'Very secure for modern consumer threat models.',
      },
      veryStrong: {
        label: 'Very Strong',
        description: 'Practically impossible to crack with current technology.',
      },
      cryptographicStandard: {
        label: 'Cryptographic Standard',
        description:
          'Mathematically inviolable for practical purposes and highly resistant even to theoretical quantum attacks.',
      },
    },
    time: {
      instantly: 'Instantly',
      second: 'second',
      seconds: 'seconds',
      minute: 'minute',
      minutes: 'minutes',
      hour: 'hour',
      hours: 'hours',
      day: 'day',
      days: 'days',
      year: 'year',
      years: 'years',
      millionYear: 'million year',
      millionYears: 'million years',
      universeLifetime: 'lifetime of the universe',
      universeLifetimes: 'lifetimes of the universe',
    },
  },
  it: {
    preTitle: 'GENERATORE SICURO',
    themeSwitchToLight: 'Passa a Chiaro',
    themeSwitchToDark: 'Passa a Scuro',
    controlsTitle: 'Controlli di Generazione',
    controlsDescription: 'Scegli lingua, separatore e numero di parole.',
    labelLanguage: 'Lingua',
    labelSeparator: 'Separatore',
    labelRequirements: 'REQUISITI',
    labelWords: 'Parole',
    separatorSpace: 'spazio',
    toggleCapitalizeWords: 'Maiuscole',
    toggleIncludeNumbers: 'Includi Numeri',
    generatePassphrase: 'Genera Passphrase',
    loadingDictionary: 'Caricamento Dizionario...',
    loadingHint: 'Caricamento parole in corso, la generazione e temporaneamente disabilitata.',
    passphraseTitle: 'La tua Passphrase',
    entropyLabel: (bits) => `Entropia: ${bits} bit`,
    securityEvaluation: 'Valutazione Sicurezza',
    bruteForceLabel: 'Tempo di brute-force stimato (RTX 5090 @ 150 GH/s)',
    copyToClipboard: 'Copia negli Appunti',
    copied: 'Copiato!',
    readyToCopy: 'Pronto da copiare',
    showPassphrase: 'Mostra passphrase',
    hidePassphrase: 'Nascondi passphrase',
    languageNames: {
      en: 'Inglese',
      it: 'Italiano',
    },
    securityLevels: {
      weak: {
        label: 'Debole',
        description: 'Può essere violata in ore o giorni con hardware specializzato.',
      },
      medium: {
        label: 'Media',
        description: 'Richiede mesi o anni, accettabile per servizi non critici.',
      },
      strong: {
        label: 'Forte',
        description: 'Molto sicura per i moderni scenari di minaccia consumer.',
      },
      veryStrong: {
        label: 'Molto Forte',
        description: 'Praticamente impossibile da violare con la tecnologia attuale.',
      },
      cryptographicStandard: {
        label: 'Standard Crittografico',
        description:
          'Inviolabile dal punto di vista matematico per scopi pratici e altamente resistente anche a ipotesi teoriche quantistiche.',
      },
    },
    time: {
      instantly: 'Istantaneo',
      second: 'secondo',
      seconds: 'secondi',
      minute: 'minuto',
      minutes: 'minuti',
      hour: 'ora',
      hours: 'ore',
      day: 'giorno',
      days: 'giorni',
      year: 'anno',
      years: 'anni',
      millionYear: 'milione di anni',
      millionYears: 'milioni di anni',
      universeLifetime: "durata dell'universo",
      universeLifetimes: "durate dell'universo",
    },
  },
}

const formatCount = (value, unitSingular, unitPlural, locale) => {
  const rounded = value >= 100 ? Math.round(value) : Number(value.toFixed(2))
  const suffix = rounded === 1 ? unitSingular : unitPlural
  return `${rounded.toLocaleString(locale)} ${suffix}`
}

const formatBruteForceTime = (seconds, labels, locale) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return labels.instantly
  }

  if (seconds < SECONDS_PER_MINUTE) {
    return formatCount(seconds, labels.second, labels.seconds, locale)
  }

  if (seconds < SECONDS_PER_HOUR) {
    return formatCount(seconds / SECONDS_PER_MINUTE, labels.minute, labels.minutes, locale)
  }

  if (seconds < SECONDS_PER_DAY) {
    return formatCount(seconds / SECONDS_PER_HOUR, labels.hour, labels.hours, locale)
  }

  if (seconds < SECONDS_PER_YEAR) {
    return formatCount(seconds / SECONDS_PER_DAY, labels.day, labels.days, locale)
  }

  const years = seconds / SECONDS_PER_YEAR

  if (years < 1_000_000) {
    return formatCount(years, labels.year, labels.years, locale)
  }

  if (years < UNIVERSE_AGE_YEARS) {
    return formatCount(years / 1_000_000, labels.millionYear, labels.millionYears, locale)
  }

  const universeLifetimes = years / UNIVERSE_AGE_YEARS
  return formatCount(
    universeLifetimes,
    labels.universeLifetime,
    labels.universeLifetimes,
    locale,
  )
}

const getRandomIndex = (maxExclusive) => {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error('maxExclusive deve essere un intero positivo')
  }

  const maxUint32 = 0x100000000
  const limit = maxUint32 - (maxUint32 % maxExclusive)
  const buffer = new Uint32Array(1)

  while (true) {
    crypto.getRandomValues(buffer)
    const value = buffer[0]

    if (value < limit) {
      return value % maxExclusive
    }
  }
}

export const usePassphraseMaker = () => {
  const minWords = 3
  const maxWords = 16
  const language = ref('en')
  const separator = ref('-')
  const wordCount = ref(6)
  const theme = ref('dark')
  const isLoading = ref(false)
  const capitalizeWords = ref(false)
  const includeNumbers = ref(false)
  const isPassphraseVisible = ref(true)
  const generatedWords = ref([])
  const dictionaryWords = ref([])
  const copied = ref(false)
  let copiedTimeoutId = null

  const uiLanguage = computed(() => (language.value === 'it' ? 'it' : 'en'))
  const uiText = computed(() => UI_TRANSLATIONS[uiLanguage.value])
  const numberLocale = computed(() => (uiLanguage.value === 'it' ? 'it-IT' : 'en-US'))

  const separatorOptions = computed(() => [
    { label: 'Hyphen (-)', value: '-' },
    { label: 'Space ( )', value: ' ' },
    { label: 'Underscore (_)', value: '_' },
  ])

  const languageOptions = computed(() => [
    { label: uiText.value.languageNames.en, value: 'en' },
    { label: uiText.value.languageNames.it, value: 'it' },
  ])

  const themeToggleLabel = computed(() =>
    theme.value === 'dark' ? uiText.value.themeSwitchToLight : uiText.value.themeSwitchToDark,
  )

  const entropyBits = computed(() => Number((wordCount.value * BITS_PER_WORD).toFixed(2)))

  const securityProfile = computed(() => {
    const entropy = entropyBits.value

    if (entropy < 60) {
      return {
        label: uiText.value.securityLevels.weak.label,
        description: uiText.value.securityLevels.weak.description,
        badgeClass: 'bg-red-600 text-white',
        progressClass: 'from-red-600 to-orange-500',
      }
    }

    if (entropy < 80) {
      return {
        label: uiText.value.securityLevels.medium.label,
        description: uiText.value.securityLevels.medium.description,
        badgeClass: 'bg-amber-500 text-black',
        progressClass: 'from-amber-400 to-yellow-500',
      }
    }

    if (entropy < 100) {
      return {
        label: uiText.value.securityLevels.strong.label,
        description: uiText.value.securityLevels.strong.description,
        badgeClass: 'bg-emerald-600 text-white',
        progressClass: 'from-emerald-500 to-lime-400',
      }
    }

    if (entropy < 128) {
      return {
        label: uiText.value.securityLevels.veryStrong.label,
        description: uiText.value.securityLevels.veryStrong.description,
        badgeClass: 'bg-green-700 text-white',
        progressClass: 'from-green-600 to-emerald-400',
      }
    }

    return {
      label: uiText.value.securityLevels.cryptographicStandard.label,
      description: uiText.value.securityLevels.cryptographicStandard.description,
      badgeClass: 'bg-blue-600 text-white',
      progressClass: 'from-blue-500 to-indigo-500',
    }
  })

  const entropyProgress = computed(() => Math.min((entropyBits.value / 160) * 100, 100))
  const totalCombinations = computed(() => WORDLIST_SIZE ** wordCount.value)
  const bruteForceSeconds = computed(() => totalCombinations.value / RTX_5090_HASH_RATE)
  const bruteForceEstimate = computed(() =>
    formatBruteForceTime(bruteForceSeconds.value, uiText.value.time, numberLocale.value),
  )

  const formattedWords = computed(() =>
    generatedWords.value.map((word, index) => {
      const normalizedWord = capitalizeWords.value
        ? `${word.charAt(0).toUpperCase()}${word.slice(1)}`
        : word

      if (includeNumbers.value) {
        return `${index + 1}${normalizedWord}`
      }

      return normalizedWord
    }),
  )

  const passphrase = computed(() => formattedWords.value.join(separator.value))
  const maskedPassphrase = computed(() => passphrase.value.replace(/[\p{L}\p{N}]/gu, '*'))
  const displayedPassphrase = computed(() =>
    isPassphraseVisible.value ? passphrase.value : maskedPassphrase.value,
  )
  const visibilityToggleLabel = computed(() =>
    isPassphraseVisible.value ? uiText.value.hidePassphrase : uiText.value.showPassphrase,
  )

  const loadDictionary = async () => {
    const dictionaryPath = DICTIONARY_PATHS[language.value]

    if (!dictionaryPath) {
      dictionaryWords.value = []
      return
    }

    isLoading.value = true

    try {
      const response = await fetch(dictionaryPath, { cache: 'no-store' })

      if (!response.ok) {
        throw new Error(`Impossibile caricare dizionario: ${response.status}`)
      }

      const parsed = await response.json()
      dictionaryWords.value = Array.isArray(parsed)
        ? parsed.filter((word) => typeof word === 'string' && word.length > 0)
        : []
    } catch (error) {
      console.error('Errore caricamento dizionario', error)
      dictionaryWords.value = []
    } finally {
      isLoading.value = false
    }
  }

  const generatePassphrase = () => {
    if (isLoading.value || dictionaryWords.value.length === 0) {
      generatedWords.value = []
      return
    }

    generatedWords.value = Array.from({ length: wordCount.value }, () => {
      const randomIndex = getRandomIndex(dictionaryWords.value.length)
      return dictionaryWords.value[randomIndex]
    })
  }

  const updateWordCount = (nextValue) => {
    const normalized = Number(nextValue)

    if (!Number.isFinite(normalized)) {
      return
    }

    wordCount.value = Math.min(maxWords, Math.max(minWords, Math.round(normalized)))
  }

  const copyPassphrase = async () => {
    if (!passphrase.value) {
      return
    }

    await navigator.clipboard.writeText(passphrase.value)

    copied.value = true
    if (copiedTimeoutId) {
      window.clearTimeout(copiedTimeoutId)
    }

    copiedTimeoutId = window.setTimeout(() => {
      copied.value = false
    }, 2000)
  }

  const applyTheme = () => {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const togglePassphraseVisibility = () => {
    isPassphraseVisible.value = !isPassphraseVisible.value
  }

  watch(theme, applyTheme, { immediate: true })
  watch(
    language,
    async () => {
      await loadDictionary()
      generatePassphrase()
    },
    { immediate: true },
  )
  watch([separator, wordCount, capitalizeWords, includeNumbers], () => {
    generatePassphrase()
  })

  return {
    BITS_PER_WORD,
    capitalizeWords,
    copied,
    copyPassphrase,
    displayedPassphrase,
    bruteForceEstimate,
    entropyBits,
    entropyProgress,
    generatePassphrase,
    includeNumbers,
    isPassphraseVisible,
    isLoading,
    language,
    languageOptions,
    loadDictionary,
    maxWords,
    minWords,
    passphrase,
    securityProfile,
    separator,
    separatorOptions,
    theme,
    themeToggleLabel,
    toggleTheme,
    togglePassphraseVisibility,
    uiText,
    updateWordCount,
    visibilityToggleLabel,
    wordCount,
  }
}
