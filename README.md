# DGM Logistikk - B2B Logistics Platform

En moderne B2B-plattform som kobler kjøpere og selgere av frakttjenester i Norge.

## 🚀 Funksjoner

- **Brukerautentisering** med e-post/passord og valgfri 2FA
- **Rollebasert tilgang** (kjøper, selger, superadmin)
- **Firmaregistrering** med godkjenningsprosess
- **Fraktforespørsler** med detaljert informasjon
- **Søk og filtrering** av forespørsler
- **Administrasjonspanel** for superadmins
- **E-postvarslinger** via Cloud Functions
- **Responsiv design** med Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Firestore, Auth, Functions, Hosting)
- **E-post**: SendGrid
- **Deployment**: Firebase Hosting

## 📁 Prosjektstruktur

```
src/
├── components/          # Gjenbrukbare komponenter
│   ├── ui/             # shadcn/ui komponenter
│   ├── AuthGuard.tsx   # Rutebeskyttelse
│   ├── Layout.tsx      # Hovedlayout
│   ├── ForespørselKort.tsx
│   └── FirmaSkjema.tsx
├── pages/              # Sider/ruter
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Requests.tsx
│   ├── NewRequest.tsx
│   ├── Company.tsx
│   ├── Profile.tsx
│   ├── Admin.tsx
│   └── Unauthorized.tsx
├── context/            # React Context
│   └── AuthContext.tsx
├── hooks/              # Custom hooks
│   ├── useRole.ts
│   └── use-toast.ts
├── lib/                # Biblioteker og konfiguration
│   ├── firebase/
│   └── utils.ts
└── types/              # TypeScript typer
    └── index.ts
```

## 🚦 Kom i gang

### 1. Installer avhengigheter

```bash
npm install
```

### 2. Sett opp Firebase

Følg instruksjonene i [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

### 3. Opprett miljøvariabler

Kopier `.env.example` til `.env` og fyll inn Firebase-konfigurasjonen:

```bash
cp .env.example .env
```

### 4. Start utviklingsserver

```bash
npm run dev
```

### 5. Start Firebase-emulatorer

```bash
firebase emulators:start
```

## 🔐 Brukerroller

### Kjøper (buyer)
- Kan opprette fraktforespørsler
- Kan se alle forespørsler
- Kan administrere sitt firma

### Selger (seller)
- Kan se alle forespørsler
- Kan kontakte kjøpere
- Får e-postvarslinger om nye forespørsler

### Superadmin
- Tilgang til administrasjonspanel
- Kan godkjenne/avvise firmaer
- Kan slette forespørsler
- Får ukentlige statistikker

## 📧 E-postvarslinger

Systemet sender automatiske e-poster for:
- Nye fraktforespørsler (til selgere)
- Firmgodkjenninger (til firmaeiere)
- Ukentlige statistikker (til superadmins)

## 🔒 Sikkerhet

- **Firestore Security Rules**: Rollbasert tilgang til data
- **Authentication Guards**: Rutebeskyttelse basert på brukerrolle
- **Input-validering**: Alle skjemaer valideres både frontend og backend
- **2FA**: Valgfri to-faktor autentisering med SMS

## 🚀 Deployment

### 1. Bygg applikasjonen

```bash
npm run build
```

### 2. Deploy til Firebase

```bash
firebase deploy
```

Eller deploy spesifikke tjenester:

```bash
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

## 🧪 Testing

```bash
# Kjør type-sjekking
npm run type-check

# Kjør linting
npm run lint

# Bygg for produksjon
npm run build
```

## 📝 API Endpoints (Cloud Functions)

- `onNewFreightRequest`: Sender e-post til selgere ved nye forespørsler
- `onCompanyApproved`: Sender e-post ved firmgodkjenning
- `weeklyStats`: Ukentlige statistikker til superadmins

## 🤝 Bidrag

1. Fork prosjektet
2. Opprett en feature branch (`git checkout -b feature/ny-funksjon`)
3. Commit endringene (`git commit -am 'Legg til ny funksjon'`)
4. Push til branchen (`git push origin feature/ny-funksjon`)
5. Opprett en Pull Request

## 📄 Lisens

Dette prosjektet er lisensiert under MIT License.

## 🆘 Support

For spørsmål eller problemer, opprett en issue i GitHub repository.
