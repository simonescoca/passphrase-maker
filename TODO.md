# TODO

- [x] 1. Setup: Scaffold struttura base Vite + Vue 3 + Tailwind CSS e configurare Tailwind con `darkMode: 'class'`.
- [x] 2. Data Mocking: Creare array placeholder per wordlist inglese e italiana (lunghezza `7776`).
- [x] 3. State & Logic: Implementare stato reattivo (`ref`, `computed`) per numero parole, lingua, separatore, tema e calcolo entropia.
- [x] 4. Core UI: Costruire interfaccia di generazione passphrase, controlli lunghezza e funzione copia negli appunti.
- [x] 5. Visual Feedback & Polish: Implementare valutazione sicurezza dinamica (badge/progress) e verificare responsività su mobile/tablet/desktop.

## PROMPT2

- [x] 1. Async Setup: creare file JSON vuoti in `public/` e implementare `fetch()` con stato reattivo `isLoading`.
- [x] 2. Formatting Logic: applicare Capitalization e Sequential Numbers in base ai toggle reattivi.
- [x] 3. UI Implementation: aggiungere toggle in interfaccia e disabilitare Generate durante loading, verificando la responsività.

## PROMPT3

- [x] 1. Node.js Script: scrivere `fetch_dicts.js`, eseguirlo e verificare che i JSON in `public/` contengano 7776 stringhe ciascuno.
- [x] 2. Estimator Logic: aggiungere il calcolo del tempo brute-force nel composable con output testuale human-readable.
- [x] 3. UI Integration: mostrare la stima RTX 5090 sotto la sezione di sicurezza e verificare aggiornamento reattivo/responsivo.

## PROMPT4

- [x] 1. Header Update: cambiare il pre-title in "SECURE GENERATOR" nel template principale.
- [x] 2. i18n Logic: creare dizionario traduzioni reattivo e helper legato alla lingua selezionata.
- [x] 3. UI Binding: sostituire tutte le stringhe hardcoded con riferimenti i18n e verificare reattività EN/IT su tutto il layout.

## PROMPT5

- [x] 1. Vite Config: aggiornare `vite.config.js` con il base path GitHub Pages `/passphrase-maker/`.
- [x] 2. Visibility Toggle: aggiungere `isPassphraseVisible`, logica mascheramento e pulsante UI, mantenendo invariata la copia reale negli appunti.
- [x] 3. PWA Setup: installare `vite-plugin-pwa`, configurare manifest + service worker in `vite.config.js` e verificare la build.
