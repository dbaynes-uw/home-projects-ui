# home-projects-ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/)

## Post-Migration UI Architecture

Final shared form/input component surface:
- `BaseForm`
- `BaseTextField`
- `BaseTextarea`
- `BaseSelect`
- `BaseIcon`
- `BaseDivider`

Conventions:
- Use `BaseSelect` with `items` (not `options`).
- Prefer `BaseTextField` with `prepend-inner` / `append-inner` slots for icon layout.
- Keep shared form controls in `src/components/ui`.

Do not reintroduce:
- Vuetify imports or plugin setup.
- Vuetify template tags (`<v-...>`).
- Temporary migration wrapper names/components.

Minimum validation command:
- `npm run build`

PROJECTS:
src/
├── components/
│   └── sleepmarkers/
│       ├── SleepMarkerCard.vue          # Display individual sleep entry
│       ├── SleepMarkerForm.vue          # Add/Edit sleep data
│       └── SleepMarkerChart.vue         # Sleep analytics/charts
├── views/
│   └── sleepmarkers/
│       ├── SleepMarkerList.vue          # Main list view
│       └── SleepMarkerView.vue          # Single entry detail view
└── store/
    └── modules/
        └── sleepmarkers.js              # Vuex store module