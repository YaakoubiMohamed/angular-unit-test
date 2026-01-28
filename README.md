# Tests Unitaires Angular - Guide Pratique avec Vitest

[![Angular](https://img.shields.io/badge/Angular-20.3-dd0031)](https://angular.dev)
[![Vitest](https://img.shields.io/badge/Vitest-3.1-6E9F18)](https://vitest.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Tutoriel interactif pour apprendre les tests unitaires Angular avec Vitest. Des concepts de base aux patterns avancés, apprenez à écrire des tests robustes et maintenables.

##  Fonctionnalités

- **Tutoriel progressif** : Du débutant à l'avancé
- **Exemples interactifs** : Testez en temps réel dans le navigateur
- **Pattern AAA** : Arrange-Act-Assert expliqué avec des exemples
- **Tests de services** : Isolation et mocking
- **Tests de composants** : TestBed, fixtures, et interactions DOM
- **Tests asynchrones** : fakeAsync, tick, et observables
- **Mocking avancé** : Espions, stubs, et fakes

##  Installation

```bash
# Cloner le dépôt
git clone https://github.com/YaakoubiMohamed/angular-unit-test.git
cd angular-unit-test

# Installer les dépendances
npm install
```

##  Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur de développement |
| `npm run build` | Build de production optimisé |
| `npm test` | Lance les tests unitaires avec Vitest |
| `npm run test:watch` | Tests en mode watch |
| `npm run test:ui` | Interface Vitest UI |
| `npm run test:coverage` | Rapport de couverture de code |
| `npm run lint` | Analyse statique avec ESLint |
| `npm run lint:fix` | Correction automatique des erreurs de lint |
| `npm run format` | Formatage du code avec Prettier |

##  Structure du Projet

```
src/
├── app/
│   ├── components/          # Composants réutilisables avec tests
│   │   ├── counter/
│   │   └── login-form/
│   ├── pages/               # Pages du tutoriel
│   │   ├── home/            # Page d'accueil
│   │   ├── concepts/        # Fondamentaux (AAA pattern)
│   │   ├── services/        # Tests de services
│   │   ├── components/      # Tests de composants
│   │   ├── async/           # Tests asynchrones
│   │   ├── mocking/         # Mocking et espions
│   │   └── playground/      # Exemples pratiques
│   └── services/            # Services avec tests
│       ├── calculator.service.ts
│       ├── discount.service.ts
│       └── temperature.service.ts
└── docs/                    # Documentation supplémentaire
```

##  Modules du Cours

### 1. Concepts Fondamentaux
- Pattern AAA (Arrange-Act-Assert)
- Structure des fichiers de test
- Bonnes pratiques

### 2. Tests de Services
- Tests unitaires sans TestBed
- Isolation des dépendances
- Couverture des cas limites

### 3. Tests de Composants
- Configuration TestBed
- Requêtes DOM avec DebugElement
- Événements utilisateur
- Entrées/Sorties (Input/Output)

### 4. Tests Asynchrones
- `fakeAsync` et `tick()`
- `waitForAsync`
- Testing HTTP avec `HttpClientTestingModule`
- Observables RxJS

### 5. Mocking et Espions
- `vi.fn()` et `vi.spyOn()`
- Mock de services
- Injection de dépendances

##  Bonnes Pratiques Appliquées

- ✅ **TypeScript strict mode** activé
- ✅ **ESLint** avec règles Angular et accessibilité
- ✅ **Lazy loading** pour toutes les routes
- ✅ **PreloadAllModules** pour une navigation fluide
- ✅ **Accessibilité** : ARIA, navigation clavier, skip links
- ✅ **Performance** : Optimisations de build, caching Netlify
- ✅ **Tests AAA** : Pattern clairement documenté
- ✅ **Composants standalone** : Architecture moderne Angular

##  Lancer les Tests

```bash
# Tests avec output minimal
npm test

# Tests en mode watch (développement)
npm run test:watch

# Interface graphique Vitest
npm run test:ui

# Couverture de code
npm run test:coverage
```

##  Couverture de Code

Le rapport de couverture est généré dans le dossier `coverage/`. Ouvrez `coverage/index.html` pour une vue détaillée.

##  Ressources

- [Documentation Angular - Testing](https://angular.dev/guide/testing)
- [Vitest Documentation](https://vitest.dev/)
- [Angular Style Guide](https://angular.dev/style-guide)
- [RxJS Testing](https://rxjs.dev/guide/testing/marble-testing)

##  Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

##  Licence

MIT © [Mohamed Yaakoubi](https://github.com/YaakoubiMohamed)
