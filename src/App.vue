<script setup>
import { computed } from 'vue'
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
  generatePassphrase,
  includeNumbers,
  isPassphraseVisible,
  isLoading,
  language,
  languageOptions,
  maxWords,
  minWords,
  passphrase,
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

const handleWordCountInput = (event) => {
  updateWordCount(event.target.value)
}

const regenerate = () => {
  generatePassphrase()
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
        <div>
          <h2 class="text-lg font-semibold">{{ uiText.controlsTitle }}</h2>
          <p class="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{{ uiText.controlsDescription }}</p>

          <div class="mt-5">
            <p class="label">{{ uiText.labelLanguage }}</p>
            <div class="mt-2 grid grid-cols-2 gap-2">
              <button
                v-for="option in languageOptions"
                :key="option.value"
                class="touch-btn rounded-xl border px-3 py-2 text-sm font-semibold transition"
                :class="language === option.value ? 'border-teal-500 bg-teal-500 text-white' : 'border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'"
                @click="language = option.value"
              >
                {{ option.label }}
              </button>
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
            <input
              class="touch-btn mt-3 w-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              type="number"
              :min="minWords"
              :max="maxWords"
              :value="wordCount"
              @input="handleWordCountInput"
            />
          </div>

          <div class="mt-5 grid gap-3">
            <label class="flex items-center justify-between rounded-xl border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
              <span class="text-sm font-medium text-zinc-800 dark:text-zinc-100">{{ uiText.toggleCapitalizeWords }}</span>
              <input v-model="capitalizeWords" class="h-5 w-5 accent-teal-500" type="checkbox" />
            </label>
            <label class="flex items-center justify-between rounded-xl border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
              <span class="text-sm font-medium text-zinc-800 dark:text-zinc-100">{{ uiText.toggleIncludeNumbers }}</span>
              <input v-model="includeNumbers" class="h-5 w-5 accent-teal-500" type="checkbox" />
            </label>
          </div>

          <button
            class="touch-btn mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-teal-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoading"
            @click="regenerate"
          >
            {{ isLoading ? uiText.loadingDictionary : uiText.generatePassphrase }}
          </button>
          <p v-if="isLoading" class="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{{ uiText.loadingHint }}</p>
        </div>

        <div class="rounded-2xl border border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/60 sm:p-5">
          <h2 class="text-lg font-semibold">{{ uiText.passphraseTitle }}</h2>
          <p class="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{{ uiText.entropyLabel(entropyBits) }}</p>

          <div class="mt-4 rounded-xl border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">{{ uiText.securityEvaluation }}</p>
              <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider" :class="securityProfile.badgeClass">
                {{ securityProfile.label }}
              </span>
            </div>
            <p class="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{{ securityProfile.description }}</p>
            <div class="mt-4 h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                class="h-full rounded-full bg-gradient-to-r transition-all duration-500"
                :class="securityProfile.progressClass"
                :style="{ width: `${entropyProgress}%` }"
              ></div>
            </div>

            <div class="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-950">
              <p class="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {{ uiText.bruteForceLabel }}
              </p>
              <p class="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">{{ bruteForceEstimate }}</p>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-dashed border-zinc-400 bg-white p-4 dark:border-zinc-600 dark:bg-zinc-900">
            <div class="flex items-start justify-between gap-3">
              <p class="break-words font-mono text-base leading-relaxed sm:text-lg">{{ displayedPassphrase }}</p>
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

          <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              class="touch-btn rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-zinc-100 dark:text-zinc-900"
              @click="copyCurrentPassphrase"
            >
              {{ uiText.copyToClipboard }}
            </button>
            <span
              class="text-sm font-semibold"
              :class="copied ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'"
            >
              {{ copied ? uiText.copied : uiText.readyToCopy }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
