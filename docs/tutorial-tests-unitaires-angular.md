#  Session 1 — Fondations & Outillage des Tests Unitaires Angular

> **Durée totale : 2 heures**  
> **Version Angular : 20+**  
> **Prérequis : Connaissances de base en Angular (composants, services)**

---

##  Objectifs de la session

À la fin de cette session, vous serez capables de :

- ✅ Expliquer **ce qu'est le test unitaire** et **pourquoi il est essentiel**
- ✅ Exécuter des tests Angular en local avec confiance
- ✅ Comprendre la **structure complète d'un fichier de test**
- ✅ Écrire et exécuter vos **premiers tests unitaires**
- ✅ Interpréter les résultats et les erreurs sans paniquer 😄

---

##  Répartition du temps

| Temps       | Sujet                                        |
| ----------- | -------------------------------------------- |
| 0–10 min    | Pourquoi les tests existent                  |
| 10–25 min   | Types de tests & philosophie Angular         |
| 25–45 min   | Outils & environnement de test               |
| 45–70 min   | Anatomie d'un fichier de test                |
| 70–95 min   | Live coding : premier vrai test unitaire     |
| 95–110 min  | Exercice guidé                               |
| 110–120 min | Débrief + devoir                             |

---

## 1️⃣ Pourquoi les tests existent (0–10 min)

### 💬 Message clé

> *« Dans les projets réels, les bugs ne viennent pas de ce que nous écrivons aujourd'hui,  
> ils viennent de ce que nous modifions demain.  
> Les tests unitaires sont des **filets de sécurité**.  
> Ils nous alertent quand un changement casse un comportement existant. »*

###  Idées fondamentales

| Concept | Explication |
|---------|-------------|
|  **Réduction des risques** | Les tests ne prouvent pas la perfection, mais minimisent les régressions |
|  **Documentation vivante** | Un test bien écrit documente le comportement attendu |
|  **Refactoring serein** | Modifier le code sans crainte de tout casser |
|  **Feedback rapide** | Détection immédiate des erreurs pendant le développement |

### 🚗 Analogie concrète

> *« Un test, c'est comme vérifier les freins avant de rouler vite.  
> On ne teste pas parce qu'on s'attend à un accident,  
> on teste pour que l'accident ne nous surprenne pas. »*

###  Statistiques parlantes

- **40%** des bugs en production auraient pu être évités par des tests unitaires
- Les équipes avec une bonne couverture de tests livrent **2x plus vite** en moyenne
- Le coût de correction d'un bug en production est **100x supérieur** à celui détecté en développement

---

## 2️⃣ Types de tests & philosophie Angular (10–25 min)

### 🔺 La pyramide des tests

```
            🔺 E2E
           (lents, peu nombreux, coûteux)
          ────────────────────
         🔶 Tests d'intégration
        (vitesse moyenne, nombre moyen)
       ──────────────────────────────
      🟢 Tests unitaires
     (rapides, nombreux, économiques)
    ────────────────────────────────────
```

###  Définitions précises

| Type de test | Cible | Exemple Angular |
|--------------|-------|-----------------|
| **Unitaire** | Une seule unité isolée | Service, Pipe, fonction pure |
| **Intégration** | Plusieurs unités ensemble | Composant + ses dépendances |
| **E2E** | Application complète | Parcours utilisateur complet |

###  Ce qu'on peut tester unitairement en Angular

```typescript
// ✅ Service - logique métier
@Injectable({ providedIn: 'root' })
export class CalculatorService { }

// ✅ Pipe - transformation de données
@Pipe({ name: 'currency', standalone: true })
export class CurrencyPipe { }

// ✅ Directive - comportement DOM
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective { }

// ✅ Fonction pure - utilitaire
export function calculateTax(amount: number, rate: number): number { }

// ✅ Composant - logique + template
@Component({ standalone: true, ... })
export class CartComponent { }
```

### ⚖️ Règle Angular

> **80% ou plus de vos tests doivent être des tests unitaires.**

### ❌ Ce que nous ne faisons PAS aujourd'hui

- Pas de Cypress / Playwright (E2E)
- Pas de connexion backend
- Pas d'automatisation navigateur complète
- Pas de tests visuels

---

## 3️⃣ Outils & environnement de test (25–45 min)

### 🧰 L'écosystème de test Angular 20

| Outil | Rôle | Fourni par défaut |
|-------|------|-------------------|
| **Jest** | Test runner (exécute les tests) | ✅ Angular 20+ |
| **Jasmine** | Bibliothèque d'assertions | ✅ Alternative |
| **TestBed** | Conteneur de test Angular | ✅ |
| **ComponentFixture** | Wrapper pour tester les composants | ✅ |

### 🖥️ Démonstration pratique

Ouvrez votre terminal et exécutez :

```bash
# Lancer tous les tests
ng test

# Mode watch (relance automatique)
ng test --watch

# Avec couverture de code
ng test --code-coverage

# Un seul fichier
ng test --include=**/calculator.service.spec.ts
```

### 📺 Ce que vous allez voir

```
Chrome Headless 120.0.6099.109: Executed 5 of 5 SUCCESS (0.234 secs)

✓ CalculatorService should add two numbers correctly
✓ CalculatorService should subtract two numbers correctly
✓ CalculatorService should multiply two numbers correctly
✓ CalculatorService should divide two numbers correctly
✓ CalculatorService should handle division by zero
```

###  Interprétation des couleurs

| Couleur | Signification |
|---------|---------------|
| 🟢 Vert | Test réussi |
| 🔴 Rouge | Test échoué |
| 🟡 Jaune | Test ignoré (skip) |

###  Message important

> *« Quand un test échoue, **rien n'est cassé**.  
> Le test est simplement en train de vous informer.  
> C'est une information précieuse, pas une punition ! »*

---

## 4️⃣ Anatomie d'un fichier de test (45–70 min)

###  Structure complète d'un fichier `.spec.ts`

```typescript
//  Imports nécessaires
import { CalculatorService } from './calculator.service';

// 🏷️ Suite de tests - regroupe les tests liés
describe('CalculatorService', () => {
  
  // 📌 Variable partagée entre les tests
  let service: CalculatorService;

  //  Préparation AVANT CHAQUE test
  beforeEach(() => {
    service = new CalculatorService();
  });

  // 🧹 Nettoyage APRÈS CHAQUE test (optionnel)
  afterEach(() => {
    // Libérer des ressources si nécessaire
  });

  // ✅ Test individuel - doit se lire comme une phrase
  it('should add two positive numbers correctly', () => {
    // 🎬 Arrange (Préparer)
    const a = 5;
    const b = 3;

    //  Act (Agir)
    const result = service.add(a, b);

    // ✔️ Assert (Vérifier)
    expect(result).toBe(8);
  });

  // Sous-groupe de tests (optionnel mais recommandé)
  describe('division', () => {
    it('should divide two numbers correctly', () => {
      expect(service.divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => service.divide(10, 0)).toThrow();
    });
  });
});
```

###  Mots-clés essentiels

| Mot-clé | Signification | Exemple |
|---------|---------------|---------|
| `describe` | Groupe de tests | `describe('MonService', () => {})` |
| `it` | Test unique | `it('should do something', () => {})` |
| `expect` | Assertion | `expect(result).toBe(5)` |
| `beforeEach` | Avant chaque test | Initialisation |
| `afterEach` | Après chaque test | Nettoyage |
| `beforeAll` | Une fois avant tous | Setup global |
| `afterAll` | Une fois après tous | Teardown global |

###  Matchers les plus utilisés

```typescript
// Égalité stricte
expect(value).toBe(5);

// Égalité profonde (objets/tableaux)
expect(obj).toEqual({ name: 'Test' });

// Véracité
expect(value).toBeTruthy();
expect(value).toBeFalsy();

// Null/Undefined
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Comparaisons numériques
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThanOrEqual(10);
expect(value).toBeCloseTo(3.14, 2); // 2 décimales

// Chaînes de caractères
expect(text).toContain('hello');
expect(text).toMatch(/pattern/);

// Tableaux
expect(array).toContain('item');
expect(array).toHaveLength(3);

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrowError('message');
```

### 📏 Règle d'or

> *« Si le nom d'un test ne peut pas être lu comme une phrase en français,  
> il faut le réécrire. »*

**❌ Mauvais :**
```typescript
it('test1', () => { });
it('works', () => { });
```

**✅ Bon :**
```typescript
it('should calculate the total with tax included', () => { });
it('should return an empty array when no items exist', () => { });
```

---

## 5️⃣ Live coding — Premier vrai test unitaire (70–95 min)

###  Étape 1 : Créer un service complet

```bash
ng generate service services/calculator --skip-tests
```

Créez le fichier `calculator.service.ts` :

```typescript
import { Injectable } from '@angular/core';

/**
 * Service de calcul mathématique
 * Fournit des opérations arithmétiques de base
 */
@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  /**
   * Additionne deux nombres
   */
  add(a: number, b: number): number {
    return a + b;
  }

  /**
   * Soustrait b de a
   */
  subtract(a: number, b: number): number {
    return a - b;
  }

  /**
   * Multiplie deux nombres
   */
  multiply(a: number, b: number): number {
    return a * b;
  }

  /**
   * Divise a par b
   * @throws Error si b est égal à zéro
   */
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division par zéro impossible');
    }
    return a / b;
  }

  /**
   * Calcule le pourcentage d'un nombre
   */
  percentage(value: number, percent: number): number {
    return (value * percent) / 100;
  }
}
```

###  Étape 2 : Créer le fichier de test

Créez `calculator.service.spec.ts` :

```typescript
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  //  Initialisation avant chaque test
  beforeEach(() => {
    service = new CalculatorService();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📐 Tests pour l'addition
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('add', () => {
    it('should add two positive numbers correctly', () => {
      // Arrange
      const a = 5;
      const b = 3;

      // Act
      const result = service.add(a, b);

      // Assert
      expect(result).toBe(8);
    });

    it('should handle negative numbers', () => {
      expect(service.add(-5, 3)).toBe(-2);
      expect(service.add(-5, -3)).toBe(-8);
    });

    it('should return the same number when adding zero', () => {
      expect(service.add(42, 0)).toBe(42);
      expect(service.add(0, 42)).toBe(42);
    });

    it('should handle decimal numbers', () => {
      const result = service.add(0.1, 0.2);
      expect(result).toBeCloseTo(0.3, 10);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ➖ Tests pour la soustraction
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('subtract', () => {
    it('should subtract two numbers correctly', () => {
      expect(service.subtract(10, 3)).toBe(7);
    });

    it('should return negative when second number is larger', () => {
      expect(service.subtract(3, 10)).toBe(-7);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✖️ Tests pour la multiplication
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(service.multiply(4, 5)).toBe(20);
    });

    it('should return zero when multiplying by zero', () => {
      expect(service.multiply(100, 0)).toBe(0);
    });

    it('should handle negative numbers correctly', () => {
      expect(service.multiply(-4, 5)).toBe(-20);
      expect(service.multiply(-4, -5)).toBe(20);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ➗ Tests pour la division
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('divide', () => {
    it('should divide two numbers correctly', () => {
      expect(service.divide(20, 4)).toBe(5);
    });

    it('should throw an error when dividing by zero', () => {
      expect(() => service.divide(10, 0)).toThrowError('Division par zéro impossible');
    });

    it('should handle decimal results', () => {
      expect(service.divide(10, 4)).toBe(2.5);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Tests pour le pourcentage
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('percentage', () => {
    it('should calculate 50% correctly', () => {
      expect(service.percentage(200, 50)).toBe(100);
    });

    it('should calculate 100% correctly', () => {
      expect(service.percentage(50, 100)).toBe(50);
    });

    it('should return zero for 0%', () => {
      expect(service.percentage(100, 0)).toBe(0);
    });
  });
});
```

###  Étape 3 : Lancer les tests

```bash
ng test
```

### Questions interactives

1. **Que se passe-t-il si on remplace `toBe(8)` par `toBe(9)` ?**
   - Le test échoue avec un message clair

2. **Angular a crashé ?** ❌
   - Non ! Le test nous a simplement informés

3. **Le test nous a protégés ?** ✅
   - Oui ! C'est exactement son rôle

---

## 6️⃣ Erreurs courantes des débutants

### ❌ Erreur 1 : Tester Angular au lieu de votre code

```typescript
// 🚫 MAUVAIS - teste que Angular fonctionne
it('should create', () => {
  expect(component).toBeDefined();
  expect(component).toBeTruthy();
});

// ✅ BON - teste VOTRE logique métier
it('should calculate the cart total correctly', () => {
  component.items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];
  expect(component.total).toBe(35);
});
```

### ❌ Erreur 2 : Un test qui fait trop de choses

```typescript
// 🚫 MAUVAIS - un test qui fait tout
it('should work', () => {
  service.addItem({ id: 1, name: 'Test' });
  expect(service.items.length).toBe(1);
  service.removeItem(1);
  expect(service.items.length).toBe(0);
  service.clearAll();
  expect(service.items).toEqual([]);
});

// ✅ BON - un test par comportement
it('should add an item to the list', () => {
  service.addItem({ id: 1, name: 'Test' });
  expect(service.items).toHaveLength(1);
});

it('should remove an item by id', () => {
  service.addItem({ id: 1, name: 'Test' });
  service.removeItem(1);
  expect(service.items).toHaveLength(0);
});

it('should clear all items', () => {
  service.addItem({ id: 1, name: 'A' });
  service.addItem({ id: 2, name: 'B' });
  service.clearAll();
  expect(service.items).toEqual([]);
});
```

### ❌ Erreur 3 : Noms de tests vagues

```typescript
// 🚫 MAUVAIS
it('test discount', () => { });
it('discount works', () => { });

// ✅ BON
it('should apply 10% discount on orders over 100€', () => { });
it('should not apply discount on orders under 100€', () => { });
it('should cap discount at 50% maximum', () => { });
```

### ❌ Erreur 4 : Avoir peur des tests rouges

> *« Un test rouge est un **retour d'information**, pas un échec personnel.  
> C'est le test qui fait son travail ! »*

### ❌ Erreur 5 : Tests dépendants les uns des autres

```typescript
// 🚫 MAUVAIS - tests qui partagent un état
let counter = 0;

it('should increment', () => {
  counter++;
  expect(counter).toBe(1);
});

it('should be at 1', () => {
  expect(counter).toBe(1); // ⚠️ Dépend du test précédent !
});

// ✅ BON - chaque test est indépendant
describe('Counter', () => {
  let counter: number;

  beforeEach(() => {
    counter = 0; // Reset avant chaque test
  });

  it('should start at zero', () => {
    expect(counter).toBe(0);
  });

  it('should increment by one', () => {
    counter++;
    expect(counter).toBe(1);
  });
});
```

---

## 🚨 Diagnostic des erreurs courantes (Bonus)

Cette section présente les **vraies erreurs** que vous rencontrerez avec les **messages exacts** affichés par le test runner, et comment les résoudre.

---

### 🔴 Erreur 1 : `Expected 180 to be 200`

**Message d'erreur complet :**
```
FAILED DiscountService > applyDiscount > should apply 10% discount correctly
  Error: Expected 180 to be 200.
    at <Jasmine>
    at UserContext.<anonymous> (src/app/services/discount.service.spec.ts:15:27)

  Expected: 200
  Received: 180
```

**Code problématique :**
```typescript
it('should apply 10% discount correctly', () => {
  const result = service.applyDiscount(200, 10);
  expect(result).toBe(200); // ❌ Erreur : on attend 200 mais on reçoit 180
});
```

**Diagnostic :**
Le test vérifie la mauvaise valeur. Après une réduction de 10% sur 200€, le résultat devrait être 180€, pas 200€.

**Solution :**
```typescript
it('should apply 10% discount correctly', () => {
  const result = service.applyDiscount(200, 10);
  expect(result).toBe(180); // ✅ Correct : 200 - 10% = 180
});
```

---

### 🔴 Erreur 2 : `Expected undefined to be 180`

**Message d'erreur complet :**
```
FAILED DiscountService > applyDiscount > should apply discount
  Error: Expected undefined to be 180.
    at <Jasmine>
    at UserContext.<anonymous> (src/app/services/discount.service.spec.ts:12:27)

  Expected: 180
  Received: undefined
```

**Code problématique :**
```typescript
describe('DiscountService', () => {
  let service: DiscountService;

  // ❌ Oubli du beforeEach - service n'est jamais initialisé !

  it('should apply discount', () => {
    const result = service.applyDiscount(200, 10); //  service est undefined
    expect(result).toBe(180);
  });
});
```

**Diagnostic :**
Le service n'a jamais été instancié. La variable `service` est déclarée mais jamais initialisée.

**Solution :**
```typescript
describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(() => {
    service = new DiscountService(); // ✅ Initialisation avant chaque test
  });

  it('should apply discount', () => {
    const result = service.applyDiscount(200, 10);
    expect(result).toBe(180);
  });
});
```

---

### 🔴 Erreur 3 : `Cannot read properties of undefined (reading 'add')`

**Message d'erreur complet :**
```
FAILED CalculatorService > add > should add two numbers
  TypeError: Cannot read properties of undefined (reading 'add')
    at UserContext.<anonymous> (src/app/services/calculator.service.spec.ts:8:28)
    at <Jasmine>
```

**Code problématique :**
```typescript
describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeAll(() => {  // ❌ beforeAll au lieu de beforeEach
    service = new CalculatorService();
  });

  it('should add two numbers', () => {
    const result = service.add(2, 3);  //  Peut échouer selon l'ordre d'exécution
    expect(result).toBe(5);
  });
});
```

**Diagnostic :**
`beforeAll` s'exécute une seule fois avant tous les tests, tandis que `beforeEach` s'exécute avant chaque test. Si un test modifie l'état du service, les autres tests peuvent échouer.

**Solution :**
```typescript
describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {  // ✅ Utiliser beforeEach pour un état frais à chaque test
    service = new CalculatorService();
  });

  it('should add two numbers', () => {
    const result = service.add(2, 3);
    expect(result).toBe(5);
  });
});
```

---

### 🔴 Erreur 4 : `Expected function to throw an error`

**Message d'erreur complet :**
```
FAILED CalculatorService > divide > should throw error when dividing by zero
  Error: Expected function to throw an Error.
    at <Jasmine>
    at UserContext.<anonymous> (src/app/services/calculator.service.spec.ts:25:42)
```

**Code problématique :**
```typescript
it('should throw error when dividing by zero', () => {
  expect(service.divide(10, 0)).toThrow(); // ❌ Appel direct de la fonction
});
```

**Diagnostic :**
`toThrow()` attend une **fonction** comme argument, pas le **résultat** d'une fonction. Ici, l'erreur est levée immédiatement avant que `toThrow()` puisse la capturer.

**Solution :**
```typescript
it('should throw error when dividing by zero', () => {
  expect(() => service.divide(10, 0)).toThrow(); // ✅ Passer une fonction fléchée
});

// Ou pour vérifier le message d'erreur :
it('should throw specific error message', () => {
  expect(() => service.divide(10, 0)).toThrowError('Division par zéro impossible');
});
```

---

### 🔴 Erreur 5 : `Expected 0.30000000000000004 to be 0.3`

**Message d'erreur complet :**
```
FAILED CalculatorService > add > should handle decimal numbers
  Error: Expected 0.30000000000000004 to be 0.3.
    at <Jasmine>
    at UserContext.<anonymous> (src/app/services/calculator.service.spec.ts:18:22)

  Expected: 0.3
  Received: 0.30000000000000004
```

**Code problématique :**
```typescript
it('should handle decimal numbers', () => {
  const result = service.add(0.1, 0.2);
  expect(result).toBe(0.3); // ❌ Problème de précision des nombres flottants
});
```

**Diagnostic :**
C'est un problème classique de **précision des nombres à virgule flottante** en JavaScript. `0.1 + 0.2` ne donne pas exactement `0.3` à cause de la représentation binaire.

**Solution :**
```typescript
it('should handle decimal numbers', () => {
  const result = service.add(0.1, 0.2);
  expect(result).toBeCloseTo(0.3, 10); // ✅ Comparaison avec précision
});

// toBeCloseTo(expected, precision)
// precision = nombre de décimales à vérifier
```

---

### 🔴 Erreur 6 : `Expected 'FREEZING' to be 'freezing'`

**Message d'erreur complet :**
```
FAILED TemperatureService > getTemperatureCategory > should return freezing
  Error: Expected 'FREEZING' to be 'freezing'.
    at <Jasmine>
    at UserContext.<anonymous> (src/app/services/temperature.service.spec.ts:45:48)

  Expected: 'freezing'
  Received: 'FREEZING'
```

**Code problématique :**
```typescript
// Dans le service
getTemperatureCategory(celsius: number): string {
  if (celsius < 0) return 'FREEZING';  // Retourne en majuscules
  // ...
}

// Dans le test
it('should return freezing for negative temps', () => {
  expect(service.getTemperatureCategory(-10)).toBe('freezing'); // ❌ Casse différente
});
```

**Diagnostic :**
Le service retourne `'FREEZING'` (majuscules) mais le test attend `'freezing'` (minuscules).

**Solutions possibles :**

```typescript
// Solution 1 : Corriger le test pour correspondre à l'implémentation
it('should return freezing for negative temps', () => {
  expect(service.getTemperatureCategory(-10)).toBe('FREEZING');
});

// Solution 2 : Utiliser une comparaison insensible à la casse
it('should return freezing for negative temps', () => {
  expect(service.getTemperatureCategory(-10).toLowerCase()).toBe('freezing');
});

// Solution 3 (recommandée) : Utiliser un type/enum dans le service
type TemperatureCategory = 'freezing' | 'cold' | 'moderate' | 'warm' | 'hot';
```

---

### 🔴 Erreur 7 : `Expected object to be a kind of Object`

**Message d'erreur complet :**
```
FAILED DiscountService > calculateDiscountDetails > should return details
  Error: Expected $.discountAmount = 20 to equal 19.99.
    at <Jasmine>
    
  Expected: Object({ originalPrice: 199.99, discountPercent: 10, discountAmount: 19.99, finalPrice: 180 })
  Received: Object({ originalPrice: 199.99, discountPercent: 10, discountAmount: 19.998999999999999, finalPrice: 179.991 })
```

**Code problématique :**
```typescript
it('should return complete discount details', () => {
  const result = service.calculateDiscountDetails(199.99, 10);
  
  expect(result).toEqual({
    originalPrice: 199.99,
    discountPercent: 10,
    discountAmount: 19.99,  // ❌ Valeur arrondie attendue
    finalPrice: 180         // ❌ Valeur arrondie attendue
  });
});
```

**Diagnostic :**
Les calculs avec des décimales produisent des résultats avec beaucoup de décimales. Le test attend des valeurs arrondies.

**Solution :**
```typescript
it('should return complete discount details', () => {
  const result = service.calculateDiscountDetails(199.99, 10);
  
  // ✅ Vérifier chaque propriété avec la bonne précision
  expect(result.originalPrice).toBe(199.99);
  expect(result.discountPercent).toBe(10);
  expect(result.discountAmount).toBeCloseTo(20, 1);
  expect(result.finalPrice).toBeCloseTo(179.99, 1);
});

// Ou modifier le service pour arrondir les résultats
```

---

### 🔴 Erreur 8 : `Spec has no expectations`

**Message d'erreur complet :**
```
FAILED DiscountService > applyDiscount > should work correctly
  Error: Spec 'DiscountService applyDiscount should work correctly' has no expectations.
```

**Code problématique :**
```typescript
it('should work correctly', () => {
  const result = service.applyDiscount(200, 10);
  console.log(result);  // ❌ Juste un log, pas d'assertion !
});
```

**Diagnostic :**
Le test n'a aucune assertion (`expect`). Un test sans `expect` ne vérifie rien.

**Solution :**
```typescript
it('should apply 10% discount correctly', () => {
  const result = service.applyDiscount(200, 10);
  expect(result).toBe(180);  // ✅ Toujours avoir au moins un expect
});
```

---

### 🔴 Erreur 9 : Tests qui passent dans le mauvais ordre

**Message d'erreur :**
```
✓ DiscountService > should apply discount (quand exécuté seul)
✗ DiscountService > should apply discount (quand exécuté avec les autres)
```

**Code problématique :**
```typescript
describe('DiscountService', () => {
  let service = new DiscountService();  // ❌ Initialisé une seule fois !
  
  it('should clear all codes', () => {
    service.clearAllCodes();  // Modifie l'état partagé
  });

  it('should have valid codes', () => {
    expect(service.isValidPromoCode('PROMO10')).toBe(true);  //  Échoue car codes effacés
  });
});
```

**Diagnostic :**
Le service est partagé entre tous les tests. Les modifications d'un test affectent les autres.

**Solution :**
```typescript
describe('DiscountService', () => {
  let service: DiscountService;
  
  beforeEach(() => {
    service = new DiscountService();  // ✅ Nouvelle instance à chaque test
  });
  
  it('should clear all codes', () => {
    service.clearAllCodes();
    expect(service.isValidPromoCode('PROMO10')).toBe(false);
  });

  it('should have valid codes', () => {
    expect(service.isValidPromoCode('PROMO10')).toBe(true);  // ✅ Fonctionne
  });
});
```

---

###  Tableau récapitulatif des erreurs

| Erreur | Cause | Solution rapide |
|--------|-------|-----------------|
| `Expected X to be Y` | Mauvaise valeur attendue | Vérifier le calcul |
| `undefined` | Service non initialisé | Ajouter `beforeEach` |
| `Cannot read properties` | Variable non définie | Vérifier l'initialisation |
| `Expected function to throw` | Appel direct vs fonction | Utiliser `() => fn()` |
| `0.30000...4 to be 0.3` | Précision flottante | Utiliser `toBeCloseTo` |
| `'ABC' to be 'abc'` | Différence de casse | Normaliser la casse |
| `Object mismatch` | Décimales dans objets | Comparer propriété par propriété |
| `No expectations` | Pas d'`expect` | Ajouter une assertion |
| Tests incohérents | État partagé | `beforeEach` pour reset |

---

###  Conseil pro : Lire les messages d'erreur

Les messages d'erreur Jasmine/Jest sont très informatifs :

```
Error: Expected 180 to be 200.
       ^^^^^^^^     ^^^^^^^^
       Reçu         Attendu
```

- **Expected** = ce que vous avez dit que ça devrait être
- **Received/Actual** = ce que le code a vraiment produit

> *« Ne paniquez pas devant une erreur. Lisez le message,  
> il vous dit exactement ce qui ne va pas ! »*

---

## 7️⃣ Exercice guidé (95–110 min)

###  Objectif

Écrire des tests unitaires complets pour un service de réduction.

###  Étape 1 : Créer le service

```bash
ng generate service services/discount --skip-tests
```

`discount.service.ts` :

```typescript
import { Injectable } from '@angular/core';

export interface DiscountResult {
  originalPrice: number;
  discountPercent: number;
  discountAmount: number;
  finalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  /**
   * Applique une réduction sur un prix
   * @param price - Prix original (doit être positif)
   * @param discountPercent - Pourcentage de réduction (0-100)
   * @returns Le prix après réduction, ou le prix original si les paramètres sont invalides
   */
  applyDiscount(price: number, discountPercent: number): number {
    // Validation des paramètres
    if (price < 0) {
      return 0;
    }
    
    if (discountPercent < 0 || discountPercent > 100) {
      return price;
    }

    const discountAmount = (price * discountPercent) / 100;
    return price - discountAmount;
  }

  /**
   * Calcule les détails complets d'une réduction
   */
  calculateDiscountDetails(price: number, discountPercent: number): DiscountResult {
    const finalPrice = this.applyDiscount(price, discountPercent);
    const discountAmount = price - finalPrice;

    return {
      originalPrice: price,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      finalPrice: finalPrice
    };
  }

  /**
   * Détermine si un code promo est valide
   */
  isValidPromoCode(code: string): boolean {
    const validCodes = ['PROMO10', 'PROMO20', 'SUMMER50', 'VIP'];
    return validCodes.includes(code.toUpperCase());
  }

  /**
   * Retourne le pourcentage de réduction pour un code promo
   */
  getDiscountForCode(code: string): number {
    const discounts: Record<string, number> = {
      'PROMO10': 10,
      'PROMO20': 20,
      'SUMMER50': 50,
      'VIP': 30
    };
    return discounts[code.toUpperCase()] ?? 0;
  }
}
```

###  Étape 2 : À vous de jouer !

Créez `discount.service.spec.ts` et écrivez des tests pour :

1. ✅ 10% de réduction sur 200€ → 180€
2. ✅ 0% de réduction → prix inchangé
3. ✅ 100% de réduction → 0€
4. ✅ Réduction invalide (>100%) → prix inchangé
5. ✅ Réduction négative → prix inchangé
6. ✅ Prix négatif → retourne 0
7. ✅ Vérification d'un code promo valide
8. ✅ Vérification d'un code promo invalide
9. ✅ Récupération du pourcentage pour un code

### 🧑‍🏫 Conseils du formateur

- Prenez le temps de **lire le code source** avant d'écrire les tests
- Posez-vous la question : *« Quel comportement est-ce que je teste ? »*
- Un test = un comportement
- N'hésitez pas à utiliser `describe` pour grouper les tests

---

## 8️⃣ Solution complète

```typescript
import { DiscountService, DiscountResult } from './discount.service';

describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(() => {
    service = new DiscountService();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 💰 Tests pour applyDiscount
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('applyDiscount', () => {
    
    describe('avec des paramètres valides', () => {
      it('should apply 10% discount correctly', () => {
        const result = service.applyDiscount(200, 10);
        expect(result).toBe(180);
      });

      it('should apply 50% discount correctly', () => {
        const result = service.applyDiscount(100, 50);
        expect(result).toBe(50);
      });

      it('should return same price for 0% discount', () => {
        const result = service.applyDiscount(200, 0);
        expect(result).toBe(200);
      });

      it('should return 0 for 100% discount', () => {
        const result = service.applyDiscount(200, 100);
        expect(result).toBe(0);
      });

      it('should handle decimal prices correctly', () => {
        const result = service.applyDiscount(99.99, 10);
        expect(result).toBeCloseTo(89.991, 2);
      });
    });

    describe('avec des paramètres invalides', () => {
      it('should return original price for discount > 100%', () => {
        const result = service.applyDiscount(200, 150);
        expect(result).toBe(200);
      });

      it('should return original price for negative discount', () => {
        const result = service.applyDiscount(200, -10);
        expect(result).toBe(200);
      });

      it('should return 0 for negative price', () => {
        const result = service.applyDiscount(-100, 10);
        expect(result).toBe(0);
      });
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Tests pour calculateDiscountDetails
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('calculateDiscountDetails', () => {
    it('should return complete discount details', () => {
      const result: DiscountResult = service.calculateDiscountDetails(200, 10);
      
      expect(result).toEqual({
        originalPrice: 200,
        discountPercent: 10,
        discountAmount: 20,
        finalPrice: 180
      });
    });

    it('should calculate zero discount amount for 0%', () => {
      const result = service.calculateDiscountDetails(100, 0);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(100);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎟️ Tests pour isValidPromoCode
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('isValidPromoCode', () => {
    it('should return true for valid promo codes', () => {
      expect(service.isValidPromoCode('PROMO10')).toBe(true);
      expect(service.isValidPromoCode('PROMO20')).toBe(true);
      expect(service.isValidPromoCode('SUMMER50')).toBe(true);
      expect(service.isValidPromoCode('VIP')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(service.isValidPromoCode('promo10')).toBe(true);
      expect(service.isValidPromoCode('Promo10')).toBe(true);
    });

    it('should return false for invalid promo codes', () => {
      expect(service.isValidPromoCode('INVALID')).toBe(false);
      expect(service.isValidPromoCode('')).toBe(false);
      expect(service.isValidPromoCode('PROMO30')).toBe(false);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Tests pour getDiscountForCode
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('getDiscountForCode', () => {
    it('should return correct discount for PROMO10', () => {
      expect(service.getDiscountForCode('PROMO10')).toBe(10);
    });

    it('should return correct discount for VIP', () => {
      expect(service.getDiscountForCode('VIP')).toBe(30);
    });

    it('should return 0 for invalid codes', () => {
      expect(service.getDiscountForCode('INVALID')).toBe(0);
    });

    it('should be case insensitive', () => {
      expect(service.getDiscountForCode('promo20')).toBe(20);
    });
  });
});
```

---

## 9️⃣ Devoir maison (110–120 min)

###  Exercice obligatoire

Créez un service `TemperatureService` avec les méthodes suivantes :

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {

  /**
   * Convertit Celsius en Fahrenheit
   * Formule : (C × 9/5) + 32
   */
  celsiusToFahrenheit(celsius: number): number {
    // À implémenter
  }

  /**
   * Convertit Fahrenheit en Celsius
   * Formule : (F - 32) × 5/9
   */
  fahrenheitToCelsius(fahrenheit: number): number {
    // À implémenter
  }

  /**
   * Convertit Celsius en Kelvin
   * Formule : C + 273.15
   */
  celsiusToKelvin(celsius: number): number {
    // À implémenter
  }

  /**
   * Détermine la catégorie de température
   * < 0°C : 'freezing'
   * 0-15°C : 'cold'
   * 15-25°C : 'moderate'
   * 25-35°C : 'warm'
   * > 35°C : 'hot'
   */
  getTemperatureCategory(celsius: number): string {
    // À implémenter
  }
}
```

### ✅ Tests à écrire (minimum 8)

| # | Scénario de test |
|---|------------------|
| 1 | 0°C → 32°F |
| 2 | 100°C → 212°F |
| 3 | -40°C → -40°F (point d'intersection) |
| 4 | 32°F → 0°C |
| 5 | 98.6°F → 37°C (température corporelle) |
| 6 | 0°C → 273.15K |
| 7 | Catégorie 'freezing' pour -10°C |
| 8 | Catégorie 'moderate' pour 20°C |

### 🌟 Bonus (étudiants avancés)

1. **Approche TDD** : Écrivez d'abord un test qui échoue, puis implémentez la méthode
2. **Validation** : Ajoutez une validation pour le zéro absolu (-273.15°C)
3. **Arrondis** : Ajoutez un paramètre optionnel pour le nombre de décimales

---

## 📌 Résumé de la Session 1

### Ce que vous devez retenir

| ✅ | Concept clé |
|----|-------------|
|  | Les tests unitaires testent le **comportement**, pas Angular |
|  | Les tests sont **rapides, locaux et sûrs** |
|  | Un test qui échoue est une **information utile**, pas un problème |
| | Chaque fonctionnalité Angular a son fichier `.spec.ts` |
|  | Un bon test se lit comme une **phrase en français** |
|  | Pattern AAA : **Arrange** → **Act** → **Assert** |

### Commandes essentielles

```bash
# Lancer tous les tests
ng test

# Tests en mode watch
ng test --watch

# Tests avec couverture
ng test --code-coverage

# Un seul fichier
ng test --include=**/mon-service.spec.ts
```

---

## 👀 Aperçu de la Session 2

> *« La prochaine fois, nous testerons de **vrais composants Angular**,  
> nous interagirons avec le **DOM**, simulerons des **clics utilisateur**,  
> et testerons les **Inputs & Outputs** —  
> c'est là que les tests Angular deviennent vraiment puissants ! »*

### Au programme :
-  Utilisation de `TestBed` et `ComponentFixture`
-  Simulation d'événements utilisateur
-  Test des `@Input()` et `@Output()`
-  Composants avec dépendances (mocks)
-  Tests asynchrones avec `fakeAsync` et `waitForAsync`

---

##  Ressources complémentaires

- [Documentation officielle Angular Testing](https://angular.io/guide/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/)

---

*Créé avec ❤️ pour l'apprentissage d'Angular 20*
