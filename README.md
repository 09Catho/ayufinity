# Ayufinit - Doctor CRM Frontend Suite

Professional frontend implementation for the Ayufinity Doctor CRM panel, built from the provided product and flow documentation.

This repository includes two equivalent frontend implementations so teams can choose their preferred stack while keeping feature coverage aligned:

- React + TypeScript + Vite + Tailwind CSS
- Vue 3 + TypeScript + Vite + Tailwind CSS

## Included Apps

- `doctor-crm-react/` - React implementation of the Doctor CRM panel
- `doctor-crm-vue/` - Vue implementation of the Doctor CRM panel

## Planned Feature Coverage

The UI is structured around the planned clinical and CRM workflow, including:

- Overview cockpit for clinic operations and KPIs
- Case workbench (intake -> interpretation -> hypotheses -> generated plans -> finalization)
- Care operations (patients, appointments, practitioner schedule context)
- Knowledge layer (tags, conditions, aliases, endpoint contracts)
- Rules and engine views (Interpretation, AAHAR, VIHAR, AUSHADH)
- Safety and evidence views (contra filtering, evidence ranking)
- Admin and access views (users, roles, supervision, settings, tokens)

It also includes a 56-table planned coverage view and endpoint read/write mapping for quick validation with product, clinical, and engineering teams.

## Tech Stack

- React 19 / Vue 3
- TypeScript
- Vite
- Tailwind CSS (`@tailwindcss/vite`)

## Getting Started

### React App

```bash
cd doctor-crm-react
npm install
npm run dev
```

### Vue App

```bash
cd doctor-crm-vue
npm install
npm run dev
```

## Production Build

### React

```bash
cd doctor-crm-react
npm run build
```

### Vue

```bash
cd doctor-crm-vue
npm run build
```

## Notes

- Both apps are responsive and optimized for desktop and mobile layouts.
- Current environment builds successfully on Node `20.18.0`, but Vite recommends `20.19+`.
- This repository currently contains frontend-only implementation (no backend wiring).
