# 🏋️ Gym-Connect

Aplicație web modernă pentru monitorizarea și gestionarea antrenamentelor de forță, cu focus pe progres măsurabil, analytics avansate și UX optimal.

## 🚀 Despre proiect

Gym-Connect te ajută să:
- Organizezi antrenamentele prin **split-uri personalizate**
- Urmărești fiecare set cu detalii (greutate, reps, RIR, volum)
- Vezi **analytics în timp real** (predicție 1RM, trend forță, evoluție volum)
- Calculezi discurile automat
- Păstrezi un istoric complet al sesiunilor

## 🛠️ Tehnologii

| Categoria | Tehnologie |
|-----------|-----------|
| **Framework** | React 19 + TypeScript |
| **Rutare** | TanStack Router + TanStack Start |
| **Build** | Vite |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI + Custom |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **State Management** | Context API + localStorage |
| **Code Quality** | ESLint |
| **Deployment** | Cloudflare Pages (via Wrangler) |

## ✨ Funcționalități

### Autentificare & Useri
- ✅ Sistem mock de autentificare (login/register/logout)
- ✅ Persistență cont cu localStorage
- ✅ Protecție rute (private/public)

### Gestionare Split-uri
- ✅ Creare/editare/ștergere split-uri
- ✅ Bibliotecă completă de exerciții (80+ exerciții)
- ✅ Atribuire exerciții pe grupuri musculare
- ✅ Salvare split-uri favorite

### Sesiuni Workout
- ✅ Pornire workout din split cu auto-populare
- ✅ Editare set-uri în timp real (greutate, reps, RIR)
- ✅ Adăugare/ștergere serii dinamice
- ✅ Marcare serie finalizată
- ✅ Timer antrenament + smart rest timer
- ✅ Calculator discuri pentru bară (plate loading)
- ✅ Salvare automată sesiuni în istoric

### Analytics & Insights
- ✅ Estimare 1RM (usando Epley/Brzycki)
- ✅ Calculul volumului total pe exercițiu
- ✅ Trend progres (regresie liniară)
- ✅ Grafice interactive (Recharts)
- ✅ Istoric sesiuni complet

### UX & Design
- ✅ Interfață responsivă (mobile-first)
- ✅ Dark mode integrat
- ✅ Animații fluide (Framer Motion)
- ✅ Toast notifications (Sonner)
- ✅ Componente UI polite (Radix UI)

## 📁 Structură Proiect

```
gym-connect/
├── src/
│   ├── routes/              # Pagini aplicației
│   │   ├── __root.tsx       # Layout global
│   │   ├── index.tsx        # Landing page public
│   │   ├── login.tsx        # Pagina login
│   │   ├── register.tsx     # Pagina register
│   │   ├── dashboard.tsx    # Layout dashboard
│   │   ├── dashboard.index.tsx      # Dashboard home
│   │   ├── dashboard.splits.tsx     # Gestionare split-uri
│   │   ├── dashboard.workout.tsx    # Sesiune workout
│   │   └── dashboard.analytics.tsx  # Analytics & insights
│   │
│   ├── components/
│   │   └── ui/              # 40+ componente UI reutilizabile (Radix)
│   │
│   ├── lib/
│   │   ├── auth.tsx         # Logica autentificare (mock)
│   │   ├── store.ts         # Persistență localStorage
│   │   ├── workout-context.tsx  # Context workout global
│   │   ├── strength-math.ts     # Calcule 1RM, volum, trend
│   │   ├── api.functions.ts     # Helper funcții (gata pentru backend)
│   │   └── utils.ts         # Utilitare generale
│   │
│   ├── data/
│   │   ├── exercises.ts     # 80+ exerciții (cu grupuri musculare)
│   │   └── mock-history.ts  # Date demo pentru testing
│   │
│   ├── hooks/
│   │   └── use-mobile.tsx   # Hook responsive
│   │
│   ├── router.tsx           # Configurare TanStack Router
│   ├── routeTree.gen.ts     # Generated (auto)
│   └── styles.css           # Global styles
│
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── tailwind.config.js       # Tailwind config
├── eslint.config.js         # ESLint rules
├── wrangler.jsonc           # Cloudflare Pages config
├── components.json          # shadcn/ui config
└── package.json
```

## 📖 Ghid de Utilizare

### 1️⃣ Înregistrare & Autentificare
```
Landing Page → "Sign Up" → Completează form → Intră în Dashboard
SAU
Login → Credentials demo → Intră în Dashboard
```

### 2️⃣ Creare Split
- Mergi la **Split-uri**
- Click "Crează Split Nou"
- Adaug exerciții din bibliotecă
- Salvează split

### 3️⃣ Pornire Workout
- Mergi la **Workout**
- Alege split din lista
- Click "Pornește Sesiune"
- Aplicația auto-populează exercițiile

### 4️⃣ Execuție Sesiune
```
Pentru fiecare exercițiu:
1. Setează greutate (kg)
2. Setează reps (1-100)
3. Alege RIR (0-10)
4. Bifează "Set complet" 
5. (Opțional) Adaug set suplimentar
6. Timer rest pornește automat
```

### 5️⃣ Analytics
- Mergi la **Analytics**
- Vezi grafice:
  - 📈 Trend forță pe exercițiu
  - 💪 Estimări 1RM
  - 📊 Volum total / sesiune
  - 📉 Evoluție progres

## ⚙️ Setup Local

### Prerequisite
- **Node.js** 18+ (recomandat 20+)
- **npm** sau **yarn**

### Instalare & Pornire

```bash
# Clonare repo
git clone https://github.com/SonDode/Gym-connect.git
cd gym-connect

# Instalare dependențe
npm install

# Rulare development server (http://localhost:8080)
npm run dev
```

### Build Producție

```bash
# Build optimizat
npm run build

# Preview build local
npm run preview
```

### Alte Comenzi

```bash
# Verificare cod (ESLint)
npm run lint

# Deploy pe Cloudflare Pages
npm run deploy  # (via wrangler)
```

## 🧩 Componente UI

Aplicația folosește **40+ componente reutilizabile** din Radix UI, personalizate cu Tailwind CSS:

- **Form Components**: Input, Checkbox, RadioGroup, Select, Textarea, Toggle, Switch
- **Data Display**: Table, Card, Badge, Progress, Skeleton, Chart
- **Navigation**: Sidebar, Tabs, Breadcrumb, Pagination, NavigationMenu
- **Dialogs & Overlays**: Dialog, Alert Dialog, Drawer, Popover, DropdownMenu, ContextMenu
- **Feedback**: Toast (Sonner), HoverCard, Tooltip
- **Utility**: Separator, AspectRatio, ScrollArea, ResizablePanels, Carousel

## 💾 Persistență & Storage

Aplicația folosește **localStorage** pentru:
```javascript
// Format exemplu
localStorage['gym-connect-user']      // Auth session
localStorage['gym-connect-splits']    // Split-uri salvate
localStorage['gym-connect-sessions']  // Istoric workout
```

## 🔗 Flow-ul Datelor

```
┌─────────────────────────────────┐
│  UI Components (React)          │
└─────────────────┬───────────────┘
                  │
┌─────────────────▼───────────────┐
│  Context API (WorkoutContext)   │  
│  State management               │
└─────────────────┬───────────────┘
                  │
┌─────────────────▼───────────────┐
│  Store Layer (localStorage)     │
│  Persistență datelor            │
└─────────────────┬───────────────┘
                  │
┌─────────────────▼───────────────┐
│  Mock Data & API Layer          │
│  Gata pentru backend real       │
└─────────────────────────────────┘
```

## 🚀 Roadmap & Viitoare Optimizări

- [ ] Backend real (Node.js/Express)
- [ ] Cloud sync (Firebase/Supabase)
- [ ] Mobile app (React Native/Flutter)
- [ ] PWA (offline mode)
- [ ] Wearable integration
- [ ] Social features (share, compare)
- [ ] Export PDF/CSV
- [ ] Advanced filtering/search

## 📝 Note Importante

- **Database**: Momentan mock în localStorage; ușor migrabil la orice backend
- **Autentificare**: Setup mock; ready for OAuth2/JWT integration
- **Calcule**: Validated și tested (Epley, Brzycki formule)
- **Responsive**: Tested și optimizat pentru mobile, tablet, desktop
- **Performance**: Optimizat cu Vite, code splitting, lazy loading

## 🐛 Debugging & Support

- Verifică **ESLint** errors: `npm run lint`
- Clear localStorage: `localStorage.clear()` în DevTools
- Check error logs în **Console**
- Încearcă **hard refresh** (Ctrl+Shift+R)

---

**Status**: 🟢 **Active Development**  
**Ultima actualizare**: Mai 2026  
**Autor**: [SonDode](https://github.com/SonDode)  
**Repository**: [github.com/SonDode/Gym-connect](https://github.com/SonDode/Gym-connect)
