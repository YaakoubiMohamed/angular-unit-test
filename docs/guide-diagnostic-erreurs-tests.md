# 🔍 Guide Pratique : Diagnostic des Erreurs de Tests

> **Objectif** : Apprendre à lire, comprendre et corriger les erreurs de tests unitaires  
> **Durée estimée** : 1h30  
> **Niveau** : Débutant à Intermédiaire

---

## 📋 Table des matières

1. [Introduction : Pourquoi les erreurs sont vos amies](#1-introduction)
2. [Comment lire un message d'erreur](#2-lecture-erreurs)
3. [Erreur 1 : Mauvaise valeur attendue](#erreur-1)
4. [Erreur 2 : Service non initialisé](#erreur-2)
5. [Erreur 3 : Problème de précision décimale](#erreur-3)
6. [Erreur 4 : toThrow mal utilisé](#erreur-4)
7. [Erreur 5 : Comparaison d'objets](#erreur-5)
8. [Erreur 6 : Test sans assertion](#erreur-6)
9. [Erreur 7 : Tests dépendants](#erreur-7)
10. [Erreur 8 : Différence de casse](#erreur-8)
11. [Exercices pratiques](#exercices)
12. [Aide-mémoire](#aide-memoire)

---

<a name="1-introduction"></a>
## 1️⃣ Introduction : Pourquoi les erreurs sont vos amies

### 🎯 Objectif de cette section

Changer votre perception des tests rouges. Un test qui échoue n'est **pas** un problème, c'est une **information précieuse**.

### 💭 Réflexion

> *« Imaginez que vous êtes médecin. Un symptôme n'est pas le problème,  
> c'est l'indice qui vous permet de trouver le problème.  
> Les messages d'erreur de tests sont vos symptômes. »*

### 📊 Les 3 types de situations

| Situation | Signification | Action |
|-----------|---------------|--------|
| ✅ Test vert | Le code fonctionne comme prévu | Continuer |
| 🔴 Test rouge | Le code OU le test a un problème | Diagnostiquer |
| 🟡 Test ignoré | Le test est désactivé temporairement | Réactiver plus tard |

### 🧠 État d'esprit à adopter

```
❌ "Mon test échoue, je suis nul"
✅ "Mon test m'informe qu'il y a une différence entre ce que j'attends et ce qui se passe"

❌ "Les tests rouges sont stressants"
✅ "Les tests rouges sont des guides vers la solution"
```

---

<a name="2-lecture-erreurs"></a>
## 2️⃣ Comment lire un message d'erreur

### 📖 Anatomie d'un message d'erreur

Voici un exemple réel de message d'erreur :

```
FAILED CalculatorService > add > should add two numbers correctly
  Error: Expected 8 to be 10.
    at <Jasmine>
    at UserContext.<anonymous> (src/app/services/calculator.service.spec.ts:25:22)

  Expected: 10
  Received: 8
```

### 🔍 Décortiquer le message

| Partie | Signification |
|--------|---------------|
| `FAILED` | Le test a échoué |
| `CalculatorService > add > should add two numbers` | Chemin complet du test (describe > describe > it) |
| `Expected 8 to be 10` | Le cœur de l'erreur |
| `calculator.service.spec.ts:25:22` | Fichier, ligne 25, colonne 22 |
| `Expected: 10` | Ce que VOUS avez dit que ça devrait être |
| `Received: 8` | Ce que le CODE a réellement produit |

### 💡 Règle d'or

> **Expected** = votre assertion (ce que vous avez écrit dans `expect().toBe()`)  
> **Received** = le résultat réel du code

### 🎯 Question à se poser

Quand un test échoue, demandez-vous :

1. **Est-ce que mon code est faux ?** → Corriger le code
2. **Est-ce que mon test est faux ?** → Corriger le test
3. **Est-ce que ma compréhension est fausse ?** → Relire la spécification

---

<a name="erreur-1"></a>
## 3️⃣ Erreur 1 : Mauvaise valeur attendue

### 📛 Message d'erreur

```
Error: Expected 180 to be 200.
  Expected: 200
  Received: 180
```

### 🔴 Code problématique

```typescript
// discount.service.spec.ts
describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(() => {
    service = new DiscountService();
  });

  it('should apply 10% discount correctly', () => {
    const result = service.applyDiscount(200, 10);
    expect(result).toBe(200); // ❌ ERREUR : on attend 200
  });
});
```

### 🧠 Diagnostic

Le développeur a confondu le **prix original** (200€) avec le **prix après réduction**.

**Calcul correct :**
- Prix original : 200€
- Réduction : 10%
- Montant de la réduction : 200 × 10% = 20€
- Prix final : 200 - 20 = **180€**

### ✅ Solution

```typescript
it('should apply 10% discount correctly', () => {
  const result = service.applyDiscount(200, 10);
  expect(result).toBe(180); // ✅ CORRECT : 200 - 10% = 180
});
```

### 📝 Exercice pratique

Ouvrez le fichier `src/app/services/discount.service.spec.ts` et trouvez la section commentée "ERREUR 1". Décommentez-la pour voir l'erreur, puis corrigez-la.

### 💡 Conseil

Avant d'écrire un test, **calculez à la main** le résultat attendu. Écrivez-le en commentaire :

```typescript
it('should apply 10% discount correctly', () => {
  // 💡 Calcul : 200 - (200 × 10 / 100) = 200 - 20 = 180
  const result = service.applyDiscount(200, 10);
  expect(result).toBe(180);
});
```

---

<a name="erreur-2"></a>
## 4️⃣ Erreur 2 : Service non initialisé (undefined)

### 📛 Message d'erreur

```
TypeError: Cannot read properties of undefined (reading 'add')
  at UserContext.<anonymous> (calculator.service.spec.ts:8:28)
```

ou

```
Error: Expected undefined to be 5.
  Expected: 5
  Received: undefined
```

### 🔴 Code problématique

```typescript
describe('CalculatorService', () => {
  let service: CalculatorService;
  
  // ❌ OUBLI : pas de beforeEach pour initialiser le service !

  it('should add two numbers', () => {
    const result = service.add(2, 3); // 💥 service est undefined
    expect(result).toBe(5);
  });
});
```

### 🧠 Diagnostic

La variable `service` est **déclarée** mais jamais **initialisée**. En TypeScript/JavaScript, une variable déclarée sans valeur a la valeur `undefined`.

Quand on essaie d'appeler `service.add()`, JavaScript essaie de lire la propriété `add` sur `undefined`, ce qui lève une erreur.

### ✅ Solution

```typescript
describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    service = new CalculatorService(); // ✅ Initialisation avant chaque test
  });

  it('should add two numbers', () => {
    const result = service.add(2, 3);
    expect(result).toBe(5);
  });
});
```

### 🔍 Pourquoi `beforeEach` et pas juste une initialisation directe ?

```typescript
// ❌ PROBLÈME : même instance partagée entre tous les tests
let service = new CalculatorService();

// ✅ SOLUTION : nouvelle instance pour chaque test
let service: CalculatorService;
beforeEach(() => {
  service = new CalculatorService();
});
```

Avec `beforeEach`, chaque test obtient une **instance fraîche** du service, ce qui évite les effets de bord entre les tests.

### 📝 Exercice pratique

1. Créez un nouveau fichier de test `test-erreur.spec.ts`
2. Écrivez un test **sans** `beforeEach`
3. Observez l'erreur
4. Corrigez en ajoutant `beforeEach`

---

<a name="erreur-3"></a>
## 5️⃣ Erreur 3 : Problème de précision décimale

### 📛 Message d'erreur

```
Error: Expected 0.30000000000000004 to be 0.3.
  Expected: 0.3
  Received: 0.30000000000000004
```

### 🔴 Code problématique

```typescript
it('should add decimal numbers', () => {
  const result = service.add(0.1, 0.2);
  expect(result).toBe(0.3); // ❌ Échoue à cause de la précision flottante
});
```

### 🧠 Diagnostic

C'est un problème fondamental de l'informatique, pas un bug de votre code !

Les ordinateurs stockent les nombres décimaux en **binaire** (base 2). Certains nombres simples en base 10 (comme 0.1) ont une représentation infinie en binaire, ce qui cause des erreurs d'arrondi minuscules.

```javascript
// Dans la console JavaScript :
console.log(0.1 + 0.2);
// Résultat : 0.30000000000000004
```

### ✅ Solution

Utilisez `toBeCloseTo()` au lieu de `toBe()` pour les nombres décimaux :

```typescript
it('should add decimal numbers', () => {
  const result = service.add(0.1, 0.2);
  expect(result).toBeCloseTo(0.3, 10); // ✅ Compare avec une précision de 10 décimales
});
```

### 📚 Syntaxe de `toBeCloseTo`

```typescript
expect(value).toBeCloseTo(expected, precision);
```

| Paramètre | Description |
|-----------|-------------|
| `expected` | La valeur attendue |
| `precision` | Nombre de décimales à vérifier (défaut: 2) |

### 📝 Exemples

```typescript
// Vérifie que le résultat est proche de 3.14 avec 2 décimales
expect(3.14159).toBeCloseTo(3.14, 2); // ✅ Passe

// Vérifie avec plus de précision
expect(3.14159).toBeCloseTo(3.14159, 5); // ✅ Passe
expect(3.14159).toBeCloseTo(3.14, 5);    // ❌ Échoue (pas assez précis)
```

### 💡 Règle

> **Toujours utiliser `toBeCloseTo()` pour les nombres décimaux !**

---

<a name="erreur-4"></a>
## 6️⃣ Erreur 4 : `toThrow` mal utilisé

### 📛 Message d'erreur

```
Error: Division par zéro impossible
  at CalculatorService.divide (calculator.service.ts:45:13)
  at UserContext.<anonymous> (calculator.service.spec.ts:30:20)
```

Le test **plante** au lieu de vérifier l'exception !

### 🔴 Code problématique

```typescript
it('should throw error when dividing by zero', () => {
  expect(service.divide(10, 0)).toThrow(); // ❌ Appel DIRECT de la fonction
});
```

### 🧠 Diagnostic

Le problème est que `service.divide(10, 0)` est **exécuté immédiatement**, ce qui lève l'exception **avant** que `toThrow()` puisse la capturer.

```typescript
// Ce qui se passe réellement :
const result = service.divide(10, 0); // 💥 Exception levée ICI
expect(result).toThrow();              // Jamais atteint
```

### ✅ Solution

Enveloppez l'appel dans une **fonction fléchée** :

```typescript
it('should throw error when dividing by zero', () => {
  expect(() => service.divide(10, 0)).toThrow(); // ✅ Fonction fléchée
});
```

### 🔍 Comment ça marche ?

```typescript
// expect reçoit une FONCTION (pas encore exécutée)
expect(() => service.divide(10, 0))
// toThrow() exécute cette fonction ET capture l'exception
.toThrow();
```

### 📚 Variantes de `toThrow`

```typescript
// Vérifie qu'une exception est levée (n'importe laquelle)
expect(() => fn()).toThrow();

// Vérifie le message exact
expect(() => fn()).toThrowError('Division par zéro impossible');

// Vérifie avec une regex
expect(() => fn()).toThrowError(/zéro/);

// Vérifie le type d'erreur
expect(() => fn()).toThrowError(TypeError);
```

### 📝 Exercice pratique

Écrivez un test pour vérifier que `CalculatorService.squareRoot(-4)` lève une exception avec le message "Racine carrée d'un nombre négatif impossible".

<details>
<summary>💡 Solution</summary>

```typescript
it('should throw error for negative square root', () => {
  expect(() => service.squareRoot(-4))
    .toThrowError("Racine carrée d'un nombre négatif impossible");
});
```

</details>

---

<a name="erreur-5"></a>
## 7️⃣ Erreur 5 : Comparaison d'objets avec `toBe`

### 📛 Message d'erreur

```
Error: Expected Object({ name: 'Alice', age: 30 }) to be Object({ name: 'Alice', age: 30 }).
```

Étrangement, les objets semblent **identiques** mais le test échoue !

### 🔴 Code problématique

```typescript
it('should return user details', () => {
  const result = service.getUser(1);
  expect(result).toBe({ name: 'Alice', age: 30 }); // ❌ Échoue !
});
```

### 🧠 Diagnostic

`toBe()` utilise une **comparaison stricte** (`===`). Pour les objets, cela compare les **références**, pas les **valeurs**.

```javascript
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };

console.log(obj1 === obj2); // false (références différentes)
console.log(obj1 === obj1); // true (même référence)
```

### ✅ Solution

Utilisez `toEqual()` pour comparer les **valeurs** des objets :

```typescript
it('should return user details', () => {
  const result = service.getUser(1);
  expect(result).toEqual({ name: 'Alice', age: 30 }); // ✅ Compare les valeurs
});
```

### 📊 Tableau comparatif

| Matcher | Comparaison | Utilisation |
|---------|-------------|-------------|
| `toBe()` | Référence (`===`) | Primitives (number, string, boolean) |
| `toEqual()` | Valeur (profonde) | Objets, tableaux |
| `toStrictEqual()` | Valeur + types | Objets avec vérification de type strict |

### 📝 Exemples

```typescript
// ✅ Primitives : utiliser toBe
expect(5).toBe(5);
expect('hello').toBe('hello');
expect(true).toBe(true);

// ✅ Objets : utiliser toEqual
expect({ a: 1 }).toEqual({ a: 1 });
expect([1, 2, 3]).toEqual([1, 2, 3]);

// ✅ Objets imbriqués
expect({ user: { name: 'Alice' } }).toEqual({ user: { name: 'Alice' } });
```

### 💡 Astuce : Comparer partiellement

Si vous ne voulez vérifier que certaines propriétés :

```typescript
expect(result).toEqual(
  expect.objectContaining({
    name: 'Alice'
    // age n'est pas vérifié
  })
);
```

---

<a name="erreur-6"></a>
## 8️⃣ Erreur 6 : Test sans assertion

### 📛 Message d'erreur

```
FAILED DiscountService > should work
  Error: Spec 'DiscountService should work' has no expectations.
```

### 🔴 Code problématique

```typescript
it('should calculate discount', () => {
  const result = service.applyDiscount(100, 10);
  console.log('Result:', result); // ❌ Juste un log, pas d'assertion !
});
```

### 🧠 Diagnostic

Un test **doit** contenir au moins une assertion (`expect`). Sans assertion, le test runner ne sait pas ce qu'il doit vérifier.

Le code s'exécute sans erreur, mais rien n'est **validé**.

### ✅ Solution

Ajoutez toujours au moins un `expect` :

```typescript
it('should calculate discount', () => {
  const result = service.applyDiscount(100, 10);
  expect(result).toBe(90); // ✅ Assertion présente
});
```

### 💡 Bonnes pratiques

```typescript
// ❌ Test sans valeur
it('should do something', () => {
  service.doSomething();
  // Pas d'expect = test inutile
});

// ✅ Test avec vérification
it('should update the counter', () => {
  service.increment();
  expect(service.counter).toBe(1);
});

// ✅ Plusieurs assertions liées (acceptable)
it('should initialize with default values', () => {
  expect(service.counter).toBe(0);
  expect(service.name).toBe('');
  expect(service.isActive).toBe(false);
});
```

### ⚠️ Attention

Évitez de mettre **trop** d'assertions dans un seul test. Si l'une échoue, vous ne savez pas si les autres auraient échoué aussi.

**Règle générale** : 1-3 assertions par test, toutes liées au même comportement.

---

<a name="erreur-7"></a>
## 9️⃣ Erreur 7 : Tests dépendants les uns des autres

### 📛 Message d'erreur

```
✓ DiscountService > should clear all codes (exécuté en premier)
✗ DiscountService > should have valid codes (exécuté en second)
  Error: Expected false to be true
```

Les tests passent quand on les exécute individuellement, mais échouent ensemble !

### 🔴 Code problématique

```typescript
describe('DiscountService', () => {
  // ❌ PROBLÈME : service créé UNE SEULE FOIS
  const service = new DiscountService();

  it('should clear all codes', () => {
    service.clearAllCodes();
    expect(service.getCodeCount()).toBe(0);
  });

  it('should have valid codes', () => {
    // ❌ Ce test dépend de l'état laissé par le précédent !
    expect(service.isValidPromoCode('PROMO10')).toBe(true);
  });
});
```

### 🧠 Diagnostic

Le problème est que le **même service** est partagé entre les deux tests. Le premier test modifie son état (efface les codes), ce qui affecte le second test.

L'ordre d'exécution des tests n'est **pas garanti** ! Ils peuvent s'exécuter dans n'importe quel ordre.

### ✅ Solution

Utilisez `beforeEach` pour créer une **nouvelle instance** avant chaque test :

```typescript
describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(() => {
    // ✅ Nouvelle instance pour chaque test
    service = new DiscountService();
  });

  it('should clear all codes', () => {
    service.clearAllCodes();
    expect(service.getCodeCount()).toBe(0);
  });

  it('should have valid codes', () => {
    // ✅ Ce test a sa propre instance, non affectée
    expect(service.isValidPromoCode('PROMO10')).toBe(true);
  });
});
```

### 📏 Principe FIRST

Les bons tests unitaires suivent le principe **FIRST** :

| Lettre | Principe | Signification |
|--------|----------|---------------|
| **F** | Fast | Rapides à exécuter |
| **I** | Independent | Indépendants les uns des autres |
| **R** | Repeatable | Même résultat à chaque exécution |
| **S** | Self-validating | Passent ou échouent clairement |
| **T** | Timely | Écrits au bon moment (avant ou avec le code) |

### 💡 Comment détecter des tests dépendants ?

Exécutez vos tests dans un **ordre aléatoire** :

```bash
# Avec Jest
ng test --randomize

# Avec Jasmine
ng test --random
```

Si des tests échouent de manière aléatoire, ils sont probablement dépendants !

---

<a name="erreur-8"></a>
## 🔟 Erreur 8 : Différence de casse (majuscules/minuscules)

### 📛 Message d'erreur

```
Error: Expected 'FREEZING' to be 'freezing'.
  Expected: 'freezing'
  Received: 'FREEZING'
```

### 🔴 Code problématique

```typescript
it('should return category in lowercase', () => {
  const category = service.getTemperatureCategory(-10);
  expect(category).toBe('freezing'); // Le service retourne 'FREEZING'
});
```

### 🧠 Diagnostic

Le test attend `'freezing'` (minuscules) mais le service retourne `'FREEZING'` (majuscules). En JavaScript, les comparaisons de chaînes sont **sensibles à la casse**.

```javascript
'hello' === 'Hello' // false
'hello' === 'hello' // true
```

### ✅ Solutions

**Option 1 : Adapter le test à l'implémentation**

```typescript
it('should return FREEZING for negative temps', () => {
  expect(service.getTemperatureCategory(-10)).toBe('FREEZING');
});
```

**Option 2 : Normaliser avant de comparer**

```typescript
it('should return freezing category (case insensitive)', () => {
  const category = service.getTemperatureCategory(-10);
  expect(category.toLowerCase()).toBe('freezing');
});
```

**Option 3 (recommandée) : Utiliser des types/enums**

```typescript
// Dans le service
export type TemperatureCategory = 'freezing' | 'cold' | 'moderate' | 'warm' | 'hot';

// Dans le test - TypeScript empêche les erreurs de casse
it('should return freezing', () => {
  const category: TemperatureCategory = service.getTemperatureCategory(-10);
  expect(category).toBe('freezing');
});
```

### 💡 Conseil

Définissez des **constantes** ou des **enums** pour les valeurs fixes :

```typescript
// constants.ts
export const TEMPERATURE_CATEGORIES = {
  FREEZING: 'freezing',
  COLD: 'cold',
  MODERATE: 'moderate',
  WARM: 'warm',
  HOT: 'hot'
} as const;

// Dans le test
import { TEMPERATURE_CATEGORIES } from './constants';

expect(category).toBe(TEMPERATURE_CATEGORIES.FREEZING);
```

---

<a name="exercices"></a>
## 📝 Exercices pratiques

### Exercice 1 : Identifier l'erreur

Pour chaque message d'erreur, identifiez le type d'erreur et proposez une solution.

**Message A :**
```
Error: Expected 45 to be 50.
```

<details>
<summary>Solution</summary>

**Type** : Mauvaise valeur attendue  
**Cause** : Le calcul dans le test ou le code est incorrect  
**Solution** : Vérifier le calcul et corriger l'assertion ou le code

</details>

**Message B :**
```
TypeError: Cannot read properties of undefined (reading 'calculate')
```

<details>
<summary>Solution</summary>

**Type** : Service non initialisé  
**Cause** : La variable n'a jamais été instanciée  
**Solution** : Ajouter un `beforeEach` avec l'initialisation

</details>

**Message C :**
```
Error: Expected 0.1 + 0.2 to be 0.3
```

<details>
<summary>Solution</summary>

**Type** : Précision décimale  
**Cause** : Les nombres flottants ont des erreurs d'arrondi  
**Solution** : Utiliser `toBeCloseTo(0.3, 10)`

</details>

---

### Exercice 2 : Corriger les tests

Voici des tests avec des erreurs. Corrigez-les :

```typescript
describe('MathService', () => {
  let service: MathService;

  it('should calculate square', () => {
    const result = service.square(5);
    expect(result).toBe(25);
  });

  it('should throw for negative sqrt', () => {
    expect(service.sqrt(-4)).toThrow();
  });

  it('should add decimals', () => {
    expect(service.add(0.1, 0.2)).toBe(0.3);
  });
});
```

<details>
<summary>Solution corrigée</summary>

```typescript
describe('MathService', () => {
  let service: MathService;

  // ✅ Ajout du beforeEach manquant
  beforeEach(() => {
    service = new MathService();
  });

  it('should calculate square', () => {
    const result = service.square(5);
    expect(result).toBe(25);
  });

  // ✅ Fonction fléchée pour toThrow
  it('should throw for negative sqrt', () => {
    expect(() => service.sqrt(-4)).toThrow();
  });

  // ✅ toBeCloseTo pour les décimales
  it('should add decimals', () => {
    expect(service.add(0.1, 0.2)).toBeCloseTo(0.3, 10);
  });
});
```

</details>

---

### Exercice 3 : Débogage en direct

1. Ouvrez `src/app/services/calculator.service.spec.ts`
2. Trouvez la section "🎓 Exemples d'erreurs"
3. Décommentez **une erreur à la fois**
4. Exécutez `ng test`
5. Observez le message d'erreur
6. Commentez à nouveau et passez à l'erreur suivante

**Objectif** : Familiarisez-vous avec les vrais messages d'erreur.

---

<a name="aide-memoire"></a>
## 📋 Aide-mémoire

### Tableau de diagnostic rapide

| Message d'erreur | Cause probable | Solution |
|------------------|----------------|----------|
| `Expected X to be Y` | Mauvaise valeur | Vérifier le calcul |
| `undefined` / `null` | Non initialisé | Ajouter `beforeEach` |
| `Cannot read properties` | Variable undefined | Vérifier l'initialisation |
| `Expected function to throw` | `toThrow` sans `() =>` | Utiliser fonction fléchée |
| `0.30000...4 to be 0.3` | Précision flottante | `toBeCloseTo()` |
| `Object to be Object` | `toBe` vs `toEqual` | Utiliser `toEqual()` |
| `No expectations` | Pas d'`expect` | Ajouter une assertion |
| `'ABC' to be 'abc'` | Casse différente | Normaliser ou type |

### Matchers les plus courants

```typescript
// Égalité
expect(x).toBe(y);           // Primitives (===)
expect(x).toEqual(y);        // Objets/tableaux (valeur)

// Véracité
expect(x).toBeTruthy();
expect(x).toBeFalsy();
expect(x).toBeNull();
expect(x).toBeUndefined();
expect(x).toBeDefined();

// Nombres
expect(x).toBeGreaterThan(y);
expect(x).toBeLessThan(y);
expect(x).toBeCloseTo(y, precision);

// Chaînes
expect(str).toContain('sub');
expect(str).toMatch(/regex/);

// Tableaux
expect(arr).toContain(item);
expect(arr).toHaveLength(n);

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrowError('message');
```

### Structure d'un test

```typescript
describe('NomDuService', () => {
  let service: NomDuService;

  beforeEach(() => {
    service = new NomDuService();
  });

  describe('nomDeLaMethode', () => {
    it('should [description du comportement]', () => {
      // Arrange (Préparer)
      const input = 'valeur';

      // Act (Agir)
      const result = service.methode(input);

      // Assert (Vérifier)
      expect(result).toBe('attendu');
    });
  });
});
```

---

## 🎯 Conclusion

Vous savez maintenant :

- ✅ Lire et comprendre les messages d'erreur
- ✅ Diagnostiquer les 8 erreurs les plus courantes
- ✅ Appliquer les solutions appropriées
- ✅ Écrire des tests robustes et indépendants

> *« Un développeur qui sait lire les erreurs de tests  
> est un développeur qui n'a plus peur des tests rouges. »*

### Prochaine étape

Passez à la pratique ! Ouvrez les fichiers de test du projet et décommentez les sections d'erreurs pour les expérimenter vous-même.

---

*Guide créé pour la formation Angular 20 - Tests Unitaires*
