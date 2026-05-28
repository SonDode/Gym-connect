# Gym-Connect

Aplicație web pentru monitorizarea antrenamentelor de forță, cu focus pe progres măsurabil: seturi, reps, greutăți, RIR, volum și estimare 1RM.

## Tehnologii folosite

- `React 19` + `TypeScript`
- `TanStack Router` + `TanStack Start`
- `Vite` pentru dezvoltare/build
- `Tailwind CSS` + componente UI bazate pe `Radix UI`
- `ESLint` + `Prettier` pentru calitatea codului
- `localStorage` pentru persistență locală (mock data, auth, sesiuni)

## Funcționalități (opționalități) implementate

- Autentificare mock (`login/register/logout`) cu persistență locală
- Landing page public + dashboard privat
- Gestionare split-uri de antrenament
  - creare/actualizare/ștergere split
  - bibliotecă de exerciții predefinită
- Sesiune de workout activă
  - pornire workout din split
  - editare serii (greutate, reps, RIR)
  - adăugare/ștergere serie
  - marcare serie finalizată
  - timer antrenament + smart rest timer
  - calculator discuri pentru bară
- Analytics
  - predicție 1RM
  - volum total
  - trend de progres (regresie liniară)
- Date mock realiste pentru demo/testing

## Logica aplicației pe scurt

1. **Datele de bază** vin din fișierele din `src/data`:
   - `exercises.ts`: catalogul de exerciții
   - `mock-history.ts`: split-uri default + istoric mock
2. **Persistența locală** este gestionată în `src/lib/store.ts`:
   - split-uri custom
   - sesiuni salvate
3. **Workout-ul activ** este gestionat prin context în `src/lib/workout-context.tsx`:
   - state live al sesiunii curente
   - operații pe seturi
   - finalizare/cancel
4. **Auth mock** este gestionat în `src/lib/auth.tsx`.
5. **Rutele/paginile** sunt în `src/routes`:
   - public: `/`, `/login`, `/register`
   - privat: `/dashboard` și subpaginile lui

## Ghid de utilizare a aplicației

### 1) Înregistrare / autentificare

- Intră pe pagina de start.
- Creează cont nou din `Register` sau autentifică-te din `Login`.

### 2) Începe un antrenament

- Intră în `Dashboard`.
- Deschide pagina de workout.
- Alege un split existent sau creează unul nou în secțiunea de split-uri.

### 3) Lucrează seturile

- Pentru fiecare exercițiu:
  - ajustează greutatea
  - setează reps (1-100)
  - alege RIR
  - bifează seria ca finalizată
- Poți adăuga/șterge serii în timp real.
- La completare, aplicația pornește automat timer de pauză.

### 4) Finalizează sesiunea

- Apasă `Finalizează antrenamentul`.
- Sesiunea este salvată în istoric.

### 5) Vezi analytics

- Intră în pagina de analytics din dashboard pentru:
  - trend forță
  - estimări 1RM
  - volume și evoluție în timp

## Cum rulezi codul local

## Cerințe

- `Node.js` 18+ (recomandat 20+)
- `npm`

### Instalare dependențe

```bash
npm install
```

### Rulare în development

```bash
npm run dev
```

Aplicația pornește, de regulă, pe [http://localhost:8080](http://localhost:8080).

### Build de producție

```bash
npm run build
```

### Preview build

```bash
npm run preview
```

### Verificare cod

```bash
npm run lint
```

### Formatare cod

```bash
npm run format
```

## Structură proiect (rezumat)

- `src/routes` - pagini și navigație
- `src/components` - componente UI
- `src/lib` - logică aplicație (auth, store, workout, math)
- `src/data` - date mock și modele

## Observații

- În starea actuală, aplicația folosește date locale/mock.
- Arhitectura este pregătită pentru migrare către backend real (ex: Supabase) prin înlocuirea layer-ului de date.
