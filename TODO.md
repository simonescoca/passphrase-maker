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

## PROMPT6

- [x] 1. Left Panel UI: riordinare i controlli (lingua, separatore, toggle, slider), sostituire il selettore lingua con dropdown stilizzato e rimuovere l'input numerico mantenendo badge + range.
- [x] 2. Auto-Generation Reactivity: rimuovere il pulsante Generate e garantire generazione automatica onMounted e a ogni variazione di lingua/separatore/lunghezza/toggle.
- [x] 3. Copy Button Polish: rendere il pulsante di copia a larghezza piena, rimuovere il testo "Ready to copy", aggiungere feedback "Copied!" con stato verde e reset dopo 2 secondi.
- [x] 4. Keyboard Shortcuts: implementare listener globali con mount/unmount per ArrowLeft/ArrowRight (word count) e Enter (copy) riutilizzando lo stesso stato visuale del click.

## PROMPT7

- [x] 1. Inline Toggles: disporre i toggle "Capitalize Words" e "Include Numbers" su singola riga con layout a due colonne.
- [x] 2. Custom Language Dropdown: rimuovere il select nativo e creare dropdown custom Vue con stato open/close, posizionamento assoluto e chiusura click-outside.
- [x] 3. Fixed Right Panel Height (Desktop): impostare altezza minima del pannello destro solo su `lg:` per evitare layout jump durante la generazione.
- [x] 4. Left Panel Vertical Spacing (Desktop): rendere il pannello sinistro una colonna flex su desktop distribuendo i controlli dall'alto verso il basso.

## PROMPT7B

- [x] 1. Underscore Wrapping: applicare `break-all` all'elemento che mostra la passphrase per evitare overflow con separatore `_`.
- [x] 2. Desktop Fixed Height: impostare altezza fissa `lg:h-[580px]` sia su pannello sinistro che destro, mantenendo layout fluido su mobile/tablet.
- [x] 3. Right Panel Vertical Distribution: applicare layout `flex flex-col justify-between h-full` al pannello destro per distribuire top/middle/bottom.

## PROMPT7C

- [x] 1. Brute-Force Overflow: aggiungere wrapping forzato (`break-all`) al valore della stima brute-force per prevenire overflow su viewport desktop stretti.
- [x] 2. Right Dynamic Boxes Fixed Height (Desktop): applicare altezze fisse su `lg:` al box stima brute-force e al box visualizzazione passphrase, mantenendo `h-auto` sotto `lg`.
- [x] 3. Left Panel Stretch Check: garantire `h-full flex flex-col justify-between` al pannello sinistro per allineare top/middle/bottom con il pannello destro a altezza fissa.
