# Passphrase Maker

![Vue 3](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06b6d4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## Introduction

Passphrase Maker is a browser-first app that generates strong, memorable passphrases from Diceware-style wordlists.

You choose language, length, and formatting rules, then the app builds a secure phrase that is easier to remember than random character strings.

### Why passphrases?

Traditional passwords often force you into short, complex-looking strings such as Tr0ub4dor&3. They look strong but are usually harder to remember and often reused with small variations.

A Diceware-style passphrase such as correct-horse-battery-staple uses multiple random words. This has two major benefits:

- It is usually easier for humans to memorize and type correctly.
- It is much harder for attackers to guess because the phrase is built from independent random words.

In practice, passphrases give a better security-usability balance: stronger resistance against brute-force attempts while remaining user-friendly.

## Technical Architecture and Cryptography

### Stack

- Vue 3 with Composition API and script setup
- Vite for fast development and production builds
- Tailwind CSS for responsive UI styling
- Vite PWA plugin for installable, offline-capable behavior

### Security architecture

- Strictly client-side: no backend, no API server, no database
- Dictionary selection and passphrase generation happen in the browser
- Offline-capable through PWA service worker setup
- Cryptographically secure randomness via Web Crypto API getRandomValues
- No Math.random usage in passphrase generation logic

### The math behind it

For a Diceware passphrase:

- L = number of generated words
- R = dictionary size
- Entropy formula:

E = L * log2(R)

With a fixed dictionary size R = 7776:

- Per-word entropy = log2(7776) ~= 12.92 bits
- Total entropy in this app is computed as E ~= L * 12.92

### Security tiers

| Tier | Entropy Range |
| --- | --- |
| Weak | E < 60 |
| Medium | 60 <= E < 80 |
| Strong | 80 <= E < 100 |
| Very Strong | 100 <= E < 128 |
| Cryptographic Standard | E >= 128 |

## Local Setup and Scripts

### Requirements

- Node.js 18+ recommended
- npm 9+ recommended

### Install

	npm install

### Run locally

	npm run dev

### Production build

	npm run build

### Fetch official dictionaries

	npm run dicts:fetch

This script downloads and converts the English and Italian Diceware-compatible sources into JSON files used by the app:

- public/eff_large_en.json
- public/diceware_it.json

## Deployment

This project is configured for GitHub Pages with base path /passphrase-maker/.

Target URL example:

https://simonescoca.github.io/passphrase-maker
