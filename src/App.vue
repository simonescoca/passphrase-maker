<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import hideBlackIcon from './icons/hide-black.png'
import hideWhiteIcon from './icons/hide-white.png'
import showBlackIcon from './icons/show-black.png'
import showWhiteIcon from './icons/show-white.png'
import { usePassphraseMaker } from './composables/usePassphraseMaker'

const {
  bruteForceEstimate,
  capitalizeWords,
  copied,
  copyPassphrase,
  displayedPassphrase,
  entropyBits,
  entropyProgress,
  includeNumbers,
  isPassphraseVisible,
  isLoading,
  language,
  languageOptions,
  maxWords,
  minWords,
  securityProfile,
  separator,
  theme,
  themeToggleLabel,
  togglePassphraseVisibility,
  toggleTheme,
  uiText,
  updateWordCount,
  visibilityToggleLabel,
  wordCount,
  separatorOptions,
} = usePassphraseMaker()

const isDropdownOpen = ref(false)

const currentLanguageOption = computed(
  () => languageOptions.value.find((option) => option.value === language.value) ?? languageOptions.value[0],
)

const handleWordCountInput = (event) => {
  updateWordCount(event.target.value)
}

const toggleLanguageDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectLanguage = (value) => {
  language.value = value
  isDropdownOpen.value = false
}

const copyCurrentPassphrase = async () => {
  try {
    await copyPassphrase()
  } catch (error) {
    console.error('Errore copia passphrase', error)
  }
}

const currentVisibilityIcon = computed(() => {
  const isDarkTheme = theme.value === 'dark'

  if (isPassphraseVisible.value) {
    return isDarkTheme ? showWhiteIcon : showBlackIcon
  }

  return isDarkTheme ? hideWhiteIcon : hideBlackIcon
})

const handleGlobalKeydown = (event) => {
  if (event.key === 'Escape') {
    isDropdownOpen.value = false
  }

  if (event.key === 'ArrowLeft') {
    updateWordCount(wordCount.value - 1)
    return
  }

  if (event.key === 'ArrowRight') {
    updateWordCount(wordCount.value + 1)
    return
  }

  if (event.key === 'Enter') {
    copyCurrentPassphrase()
  }
}

const handleDocumentClick = (event) => {
  const target = event.target

  if (!(target instanceof Element)) {
    return
  }

  if (!target.closest('[data-language-dropdown]')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
  <main class="min-h-screen bg-page px-4 py-6 text-ink sm:px-6 md:px-10 lg:px-14 dark:bg-page-dark dark:text-ink-dark">
    <div class="mx-auto w-full max-w-6xl">
      <header class="motion-rise mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.22em] text-teal-700/80 dark:text-teal-300/80">{{ uiText.preTitle }}</p>
          <h1 class="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">Passphrase Maker</h1>
        </div>
        <button
          class="touch-btn rounded-full border border-black/20 bg-white/90 px-5 py-2 text-sm font-semibold text-black transition hover:-translate-y-0.5 dark:border-white/30 dark:bg-zinc-900/80 dark:text-white"
          @click="toggleTheme"
        >
          {{ themeToggleLabel }}
        </button>
      </header>

      <section class="motion-rise grid gap-4 rounded-3xl border border-black/15 bg-white/85 p-4 shadow-xl shadow-cyan-900/10 backdrop-blur sm:p-6 md:grid-cols-2 md:gap-6 lg:p-8 dark:border-white/15 dark:bg-zinc-900/70 dark:shadow-black/40">
        <div class="h-full flex flex-col justify-between lg:h-[620px]">
          <div>
            <h2 class="text-lg font-semibold">{{ uiText.controlsTitle }}</h2>
            <p class="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{{ uiText.controlsDescription }}</p>

            <div class="mt-5" data-language-dropdown>
              <p class="label">{{ uiText.labelLanguage }}</p>
              <div class="relative mt-2">
                <button
                  type="button"
                  class="touch-btn flex w-full items-center justify-between rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:border-teal-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  :aria-expanded="isDropdownOpen"
                  @click="toggleLanguageDropdown"
                >
                  <span>{{ currentLanguageOption?.label }}</span>
                  <span class="text-xs" :class="isDropdownOpen ? 'rotate-180' : ''">v</span>
                </button>

                <ul
                  v-if="isDropdownOpen"
                  class="absolute z-10 mt-2 w-full rounded-xl border border-zinc-300 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <li v-for="option in languageOptions" :key="option.value">
                    <button
                      type="button"
                      class="touch-btn w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition"
                      :class="language === option.value
                        ? 'bg-teal-500 text-white'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800'"
                      @click="selectLanguage(option.value)"
                    >
                      {{ option.label }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div class="mt-5">
              <p class="label">{{ uiText.labelSeparator }}</p>
              <div class="mt-2 grid grid-cols-3 gap-2">
                <button
                  v-for="option in separatorOptions"
                  :key="option.value"
                  class="touch-btn rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition sm:text-sm"
                  :class="separator === option.value ? 'border-teal-500 bg-teal-500 text-white' : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'"
                  @click="separator = option.value"
                >
                  {{ option.value === ' ' ? uiText.separatorSpace : option.value }}
                </button>
              </div>
            </div>

            <div class="mt-5">
              <p class="label">{{ uiText.labelRequirements }}</p>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <button
                  class="touch-btn rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition sm:text-sm"
                  :class="capitalizeWords ? 'border-teal-500 bg-teal-500 text-white' : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'"
                  @click="capitalizeWords = !capitalizeWords"
                >
                  {{ uiText.toggleCapitalizeWords }}
                </button>
                <button
                  class="touch-btn rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition sm:text-sm"
                  :class="includeNumbers ? 'border-teal-500 bg-teal-500 text-white' : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'"
                  @click="includeNumbers = !includeNumbers"
                >
                  {{ uiText.toggleIncludeNumbers }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-5 lg:mt-8">
            <div class="flex items-center justify-between">
              <p class="label">{{ uiText.labelWords }}</p>
              <span class="rounded-full bg-zinc-900 px-3 py-1 text-sm font-bold text-white dark:bg-zinc-200 dark:text-black">
                {{ wordCount }}
              </span>
            </div>
            <input
              class="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-300 dark:bg-zinc-700"
              type="range"
              :min="minWords"
              :max="maxWords"
              :value="wordCount"
              @input="handleWordCountInput"
            />
            <p v-if="isLoading" class="mt-5 text-xs text-zinc-600 dark:text-zinc-400">{{ uiText.loadingHint }}</p>
          </div>
        </div>

        <div class="h-auto rounded-2xl border border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/60 sm:p-5 lg:h-[620px] lg:flex lg:flex-col lg:justify-between">
          <div>
            <h2 class="text-lg font-semibold">{{ uiText.passphraseTitle }}</h2>
            <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{{ uiText.entropyLabel(entropyBits) }}</p>
          </div>

          <div class="mt-4 rounded-xl border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 lg:mt-6">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">{{ uiText.securityEvaluation }}</p>
              <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider" :class="securityProfile.badgeClass">
                {{ securityProfile.label }}
              </span>
            </div>
            <p class="mt-2 text-sm text-zinc-700 dark:text-zinc-300 lg:min-h-[3rem]">{{ securityProfile.description }}</p>
            <div class="mt-4 h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                class="h-full rounded-full bg-gradient-to-r transition-all duration-500"
                :class="securityProfile.progressClass"
                :style="{ width: `${entropyProgress}%` }"
              ></div>
            </div>

            <div class="mt-4 h-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-950 lg:h-[96px]">
              <p class="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {{ uiText.bruteForceLabel }}
              </p>
              <p class="mt-1 break-all text-sm font-semibold text-zinc-800 dark:text-zinc-100">{{ bruteForceEstimate }}</p>
            </div>
          </div>

          <div class="mt-4 lg:mt-6">
            <div class="h-auto rounded-xl border border-dashed border-zinc-400 bg-white p-4 dark:border-zinc-600 dark:bg-zinc-900 lg:h-[160px]">
              <div class="flex items-start justify-between gap-3">
                <p class="break-all font-mono text-base leading-relaxed sm:text-lg">{{ displayedPassphrase }}</p>
                <button
                  class="touch-btn shrink-0 rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                  type="button"
                  :aria-label="visibilityToggleLabel"
                  :title="visibilityToggleLabel"
                  @click="togglePassphraseVisibility"
                >
                  <img
                    :src="currentVisibilityIcon"
                    :alt="visibilityToggleLabel"
                    class="h-6 w-6 shrink-0 opacity-80 transition-opacity hover:opacity-100"
                  />
                </button>
              </div>
            </div>

            <div class="mt-4">
              <button
                class="touch-btn w-full rounded-xl px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
                :class="copied
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400'
                  : 'bg-zinc-900 text-white hover:-translate-y-0.5 dark:bg-zinc-100 dark:text-zinc-900'"
                @click="copyCurrentPassphrase"
              >
                {{ copied ? uiText.copied : uiText.copyToClipboard }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
