# Tutorial: Unit Testing Angular avec Vitest

> **Formation Progressive** - Du débutant à l'expert  
> **Durée estimée**: 4-6 heures (répartie sur plusieurs sessions)  
> **Prérequis**: Connaissances de base en Angular et TypeScript

---

##  Table des Matières

1. [Session 1: Introduction aux Tests Unitaires](#session-1-introduction-aux-tests-unitaires)
2. [Session 2: Tester les Services Simples](#session-2-tester-les-services-simples)
3. [Session 3: Tester les Composants UI](#session-3-tester-les-composants-ui)
4. [Session 4: Interactions Utilisateur (Clics, Inputs)](#session-4-interactions-utilisateur)
5. [Session 5: Tests Asynchrones](#session-5-tests-asynchrones)
6. [Session 6: Mocking et Spies avec Vitest](#session-6-mocking-et-spies)
7. [ Exercices Pratiques avec Solutions](#exercices-pratiques)
8. [ Quiz & Pièges Courants](#quiz-et-pièges)

---

# Session 1: Introduction aux Tests Unitaires

##  Objectifs
- Comprendre pourquoi tester
- Installer et configurer Vitest
- Écrire votre premier test

## 1.1 Pourquoi tester ?

```
Sans tests:
Code → 🙏 Espérer que ça marche → Production →  Bugs

Avec tests:
Code → ✅ Tests automatisés →  Confiance → Production → 😌 Sérénité
```

## 1.2 Structure d'un test

Chaque test suit le pattern **AAA** (Arrange, Act, Assert):

```typescript
it('should add two numbers', () => {
  //  ARRANGE - Préparer les données
  const a = 5;
  const b = 3;
  
  // 🎬 ACT - Exécuter l'action
  const result = a + b;
  
  // ✅ ASSERT - Vérifier le résultat
  expect(result).toBe(8);
});
```

## 1.3 Les fonctions de base

| Fonction | Rôle |
|----------|------|
| `describe()` | Grouper des tests liés |
| `it()` ou `test()` | Définir un cas de test |
| `expect()` | Créer une assertion |
| `beforeEach()` | Code exécuté avant chaque test |
| `afterEach()` | Code exécuté après chaque test |

## 1.4 Premier test simple

Créez un fichier `math.spec.ts`:

```typescript
describe('Opérations mathématiques', () => {
  
  it('should return 4 when adding 2 + 2', () => {
    expect(2 + 2).toBe(4);
  });
  
  it('should return 6 when multiplying 2 * 3', () => {
    expect(2 * 3).toBe(6);
  });
  
});
```

###  Exercice Session 1

Écrivez un test qui vérifie que `10 / 2` égale `5`.

<details>
<summary> Solution</summary>

```typescript
it('should return 5 when dividing 10 / 2', () => {
  expect(10 / 2).toBe(5);
});
```
</details>

---

# Session 2: Tester les Services Simples

##  Objectifs
- Tester un service Angular
- Utiliser les assertions courantes
- Comprendre `beforeEach`

## 2.1 Créer un service à tester

```typescript
// calculator.service.ts
export class CalculatorService {
  add(a: number, b: number): number {
    return a + b;
  }
  
  subtract(a: number, b: number): number {
    return a - b;
  }
  
  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }
}
```

## 2.2 Test du service

```typescript
// calculator.service.spec.ts
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  //  Exécuté AVANT chaque test
  beforeEach(() => {
    service = new CalculatorService();
  });

  describe('add', () => {
    it('should add 5 + 3 = 8', () => {
      const result = service.add(5, 3);
      expect(result).toBe(8);
    });

    it('should handle negative numbers', () => {
      expect(service.add(-5, 3)).toBe(-2);
    });
  });

  describe('divide', () => {
    it('should divide 10 / 2 = 5', () => {
      expect(service.divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      // ⚠️ Important: Utiliser une fonction fléchée !
      expect(() => service.divide(10, 0)).toThrow();
    });
  });
});
```

## 2.3 Assertions courantes

| Assertion | Usage |
|-----------|-------|
| `toBe(value)` | Égalité stricte (===) |
| `toEqual(obj)` | Égalité profonde (objets) |
| `toBeTruthy()` | Valeur "truthy" |
| `toBeFalsy()` | Valeur "falsy" |
| `toBeNull()` | Exactement null |
| `toBeUndefined()` | Exactement undefined |
| `toContain(item)` | Contient un élément |
| `toThrow()` | Lance une exception |
| `toBeCloseTo(n)` | Proche de (pour décimaux) |

---

### 🚨 PIÈGE #1 : Tester les exceptions

```typescript
// ❌ INCORRECT - L'erreur est levée AVANT toThrow()
it('BAD - throws immediately', () => {
  expect(service.divide(10, 0)).toThrow(); //  CRASH!
});

// ✅ CORRECT - Envelopper dans une fonction fléchée
it('GOOD - catches the error', () => {
  expect(() => service.divide(10, 0)).toThrow();
});
```

###  Quiz Rapide

**Question**: Pourquoi ce test échoue-t-il ?

```typescript
it('test décimaux', () => {
  expect(0.1 + 0.2).toBe(0.3);
});
```

<details>
<summary> Réponse</summary>

En JavaScript, `0.1 + 0.2 = 0.30000000000000004` à cause de la précision des nombres flottants.

**Solution**: Utiliser `toBeCloseTo()`:
```typescript
expect(0.1 + 0.2).toBeCloseTo(0.3, 10);
```
</details>

---

# Session 3: Tester les Composants UI

##  Objectifs
- Configurer TestBed
- Accéder aux éléments du DOM
- Tester l'affichage initial

## 3.1 Structure d'un test de composant

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    // 1️⃣ Configurer le module de test
    await TestBed.configureTestingModule({
      imports: [CounterComponent]
    }).compileComponents();

    // 2️⃣ Créer le composant
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    
    // 3️⃣ Déclencher la détection de changements
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 3.2 Accéder aux éléments du DOM

```typescript
// Méthode 1: Via nativeElement (querySelector standard)
const title = fixture.nativeElement.querySelector('h1');

// Méthode 2: Via debugElement (recommandé avec data-testid)
const button = fixture.debugElement.query(By.css('[data-testid="increment-btn"]'));

// Accéder au contenu
const text = title.textContent;
const isDisabled = button.nativeElement.disabled;
```

## 3.3 Bonnes pratiques: data-testid

```html
<!-- ✅ BON: Utiliser data-testid -->
<button data-testid="submit-btn">Submit</button>

<!-- ❌ MAUVAIS: Sélecteur fragile -->
<button class="btn btn-primary">Submit</button>
```

```typescript
// ✅ Robuste - ne casse pas si on change le style
fixture.debugElement.query(By.css('[data-testid="submit-btn"]'));

// ❌ Fragile - casse si on renomme la classe
fixture.debugElement.query(By.css('.btn-primary'));
```

## 3.4 Exemple complet: Counter

**Le composant:**
```typescript
@Component({
  template: `
    <h2 data-testid="title">Counter: {{ count() }}</h2>
    <button data-testid="increment-btn" (click)="increment()">+</button>
    <button data-testid="decrement-btn" (click)="decrement()" [disabled]="count() <= 0">-</button>
  `
})
export class CounterComponent {
  count = signal(0);
  
  increment() { this.count.update(v => v + 1); }
  decrement() { if (this.count() > 0) this.count.update(v => v - 1); }
}
```

**Les tests:**
```typescript
describe('CounterComponent', () => {
  // ... beforeEach setup ...

  it('should display initial count of 0', () => {
    const title = fixture.debugElement.query(By.css('[data-testid="title"]'));
    expect(title.nativeElement.textContent).toContain('Counter: 0');
  });

  it('should disable decrement button when count is 0', () => {
    const decrementBtn = fixture.debugElement.query(By.css('[data-testid="decrement-btn"]'));
    expect(decrementBtn.nativeElement.disabled).toBe(true);
  });
});
```

---

# Session 4: Interactions Utilisateur

##  Objectifs
- Simuler des clics
- Simuler des saisies clavier
- Vérifier les changements d'état

## 4.1 Simuler un clic

```typescript
it('should increment counter when + button is clicked', () => {
  // 1️⃣ Trouver le bouton
  const incrementBtn = fixture.debugElement.query(By.css('[data-testid="increment-btn"]'));
  
  // 2️⃣ Simuler le clic
  incrementBtn.nativeElement.click();
  
  // 3️⃣ IMPORTANT: Déclencher la détection de changements
  fixture.detectChanges();
  
  // 4️⃣ Vérifier le résultat
  expect(component.count()).toBe(1);
});
```

### 🚨 PIÈGE #2 : Oublier fixture.detectChanges()

```typescript
// ❌ ÉCHOUE - Le DOM n'est pas mis à jour
it('BAD test', () => {
  const btn = fixture.debugElement.query(By.css('[data-testid="increment-btn"]'));
  btn.nativeElement.click();
  // ⚠️ Oubli de fixture.detectChanges() !
  
  const title = fixture.debugElement.query(By.css('[data-testid="title"]'));
  expect(title.nativeElement.textContent).toContain('Counter: 1'); //  FAIL!
});

// ✅ RÉUSSIT - Le DOM est synchronisé
it('GOOD test', () => {
  const btn = fixture.debugElement.query(By.css('[data-testid="increment-btn"]'));
  btn.nativeElement.click();
  fixture.detectChanges(); // ✅ Mise à jour du DOM
  
  const title = fixture.debugElement.query(By.css('[data-testid="title"]'));
  expect(title.nativeElement.textContent).toContain('Counter: 1'); // ✅ PASS!
});
```

## 4.2 Simuler une saisie dans un input

```typescript
it('should update email when user types', async () => {
  // 1️⃣ Trouver l'input
  const emailInput = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
  
  // 2️⃣ Modifier la valeur
  emailInput.nativeElement.value = 'test@example.com';
  
  // 3️⃣ Déclencher l'événement input
  emailInput.nativeElement.dispatchEvent(new Event('input'));
  
  // 4️⃣ Attendre la stabilité (pour ngModel)
  fixture.detectChanges();
  await fixture.whenStable();
  
  // 5️⃣ Vérifier
  expect(component.email).toBe('test@example.com');
});
```

## 4.3 Simuler un blur (perte de focus)

```typescript
it('should validate email on blur', () => {
  const emailInput = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
  
  // Simuler la perte de focus
  emailInput.nativeElement.dispatchEvent(new Event('blur'));
  fixture.detectChanges();
  
  // Vérifier le message d'erreur
  const error = fixture.debugElement.query(By.css('[data-testid="email-error"]'));
  expect(error.nativeElement.textContent).toContain('Email is required');
});
```

## 4.4 Clics multiples

```typescript
it('should increment 5 times', () => {
  const btn = fixture.debugElement.query(By.css('[data-testid="increment-btn"]'));
  
  for (let i = 0; i < 5; i++) {
    btn.nativeElement.click();
  }
  fixture.detectChanges();
  
  expect(component.count()).toBe(5);
});
```

---

# Session 5: Tests Asynchrones

##  Objectifs
- Tester les opérations async/await
- Utiliser `fixture.whenStable()`
- Gérer les timers

## 5.1 Attendre la stabilité

```typescript
it('should handle async form binding', async () => {
  const input = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
  
  input.nativeElement.value = 'test@example.com';
  input.nativeElement.dispatchEvent(new Event('input'));
  
  fixture.detectChanges();
  await fixture.whenStable(); // ⏳ Attendre que tout soit stable
  
  expect(component.email).toBe('test@example.com');
});
```

## 5.2 Tester une soumission de formulaire

```typescript
it('should show success after login', async () => {
  // Remplir le formulaire
  component.email = 'test@example.com';
  component.password = 'password123';
  fixture.detectChanges();
  
  // Soumettre (retourne une Promise)
  await component.onSubmit();
  fixture.detectChanges();
  
  // Vérifier le succès
  const successMsg = fixture.debugElement.query(By.css('[data-testid="success-message"]'));
  expect(successMsg.nativeElement.textContent).toContain('Login successful');
});
```

## 5.3 Tester un état de chargement

```typescript
it('should show loading state during submission', async () => {
  component.email = 'test@example.com';
  component.password = 'validpassword';
  fixture.detectChanges();
  
  // Démarrer la soumission (ne pas await tout de suite)
  const submitPromise = component.onSubmit();
  fixture.detectChanges();
  
  // Vérifier l'état de chargement PENDANT l'opération
  expect(component.isLoading()).toBe(true);
  
  // Maintenant attendre la fin
  await submitPromise;
  fixture.detectChanges();
  
  expect(component.isLoading()).toBe(false);
});
```

---

# Session 6: Mocking et Spies

##  Objectifs
- Créer des mocks avec `vi.fn()`
- Espionner des méthodes avec `vi.spyOn()`
- Mocker les timers

## 6.1 Mock de fonction

```typescript
import { vi } from 'vitest';

it('should call mock function', () => {
  // Créer un mock
  const mockFn = vi.fn();
  
  // L'appeler
  mockFn('hello', 'world');
  
  // Vérifications
  expect(mockFn).toHaveBeenCalled();
  expect(mockFn).toHaveBeenCalledWith('hello', 'world');
  expect(mockFn).toHaveBeenCalledTimes(1);
});
```

## 6.2 Mock avec valeur de retour

```typescript
it('should return mocked value', () => {
  const mockFn = vi.fn().mockReturnValue(42);
  
  const result = mockFn();
  
  expect(result).toBe(42);
});
```

## 6.3 Espionner une méthode existante

```typescript
it('should spy on validateEmail method', () => {
  const spy = vi.spyOn(component, 'validateEmail');
  
  component.validateEmail();
  
  expect(spy).toHaveBeenCalled();
  spy.mockRestore(); // Nettoyer après
});
```

## 6.4 Mocker les timers

```typescript
it('should handle setTimeout', async () => {
  vi.useFakeTimers(); // Activer les faux timers
  
  component.email = 'test@example.com';
  component.password = 'validpassword';
  
  const submitPromise = component.onSubmit();
  
  // Avancer le temps de 1 seconde
  vi.advanceTimersByTime(1000);
  
  await submitPromise;
  
  expect(component.successMessage()).toContain('Login successful');
  
  vi.useRealTimers(); // Restaurer les vrais timers
});
```

---

#  Exercices Pratiques

## Exercice 1: Service de Température (Facile)

Créez un test pour le service suivant:

```typescript
export class TemperatureService {
  celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
  }
}
```

**À tester:**
1. 0°C = 32°F
2. 100°C = 212°F
3. -40°C = -40°F

<details>
<summary> Solution</summary>

```typescript
describe('TemperatureService', () => {
  let service: TemperatureService;
  
  beforeEach(() => {
    service = new TemperatureService();
  });
  
  it('should convert 0°C to 32°F', () => {
    expect(service.celsiusToFahrenheit(0)).toBe(32);
  });
  
  it('should convert 100°C to 212°F', () => {
    expect(service.celsiusToFahrenheit(100)).toBe(212);
  });
  
  it('should convert -40°C to -40°F', () => {
    expect(service.celsiusToFahrenheit(-40)).toBe(-40);
  });
});
```
</details>

---

## Exercice 2: Bouton Toggle (Moyen)

Créez un composant avec un bouton qui affiche "ON" ou "OFF" et testez-le:

```typescript
@Component({
  template: `
    <button data-testid="toggle-btn" (click)="toggle()">
      {{ isOn() ? 'ON' : 'OFF' }}
    </button>
  `
})
export class ToggleComponent {
  isOn = signal(false);
  toggle() { this.isOn.update(v => !v); }
}
```

**À tester:**
1. Le texte initial est "OFF"
2. Après un clic, le texte est "ON"
3. Après deux clics, le texte est "OFF"

<details>
<summary> Solution</summary>

```typescript
describe('ToggleComponent', () => {
  let fixture: ComponentFixture<ToggleComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ToggleComponent);
    fixture.detectChanges();
  });
  
  it('should display OFF initially', () => {
    const btn = fixture.debugElement.query(By.css('[data-testid="toggle-btn"]'));
    expect(btn.nativeElement.textContent.trim()).toBe('OFF');
  });
  
  it('should display ON after one click', () => {
    const btn = fixture.debugElement.query(By.css('[data-testid="toggle-btn"]'));
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(btn.nativeElement.textContent.trim()).toBe('ON');
  });
  
  it('should display OFF after two clicks', () => {
    const btn = fixture.debugElement.query(By.css('[data-testid="toggle-btn"]'));
    btn.nativeElement.click();
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(btn.nativeElement.textContent.trim()).toBe('OFF');
  });
});
```
</details>

---

## Exercice 3: Validation de formulaire (Difficile)

Testez un champ email avec validation:

```typescript
@Component({
  template: `
    <input data-testid="email" [(ngModel)]="email" (blur)="validate()">
    <span data-testid="error" *ngIf="error()">{{ error() }}</span>
  `
})
export class EmailComponent {
  email = '';
  error = signal('');
  
  validate() {
    if (!this.email) {
      this.error.set('Email requis');
    } else if (!this.email.includes('@')) {
      this.error.set('Email invalide');
    } else {
      this.error.set('');
    }
  }
}
```

<details>
<summary> Solution</summary>

```typescript
describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailComponent, FormsModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });
  
  it('should show "Email requis" when empty', () => {
    const input = fixture.debugElement.query(By.css('[data-testid="email"]'));
    input.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    
    const error = fixture.debugElement.query(By.css('[data-testid="error"]'));
    expect(error.nativeElement.textContent).toContain('Email requis');
  });
  
  it('should show "Email invalide" for email without @', async () => {
    const input = fixture.debugElement.query(By.css('[data-testid="email"]'));
    input.nativeElement.value = 'invalidemail';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    
    input.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    
    const error = fixture.debugElement.query(By.css('[data-testid="error"]'));
    expect(error.nativeElement.textContent).toContain('Email invalide');
  });
  
  it('should show no error for valid email', async () => {
    const input = fixture.debugElement.query(By.css('[data-testid="email"]'));
    input.nativeElement.value = 'test@example.com';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    
    input.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    
    const error = fixture.debugElement.query(By.css('[data-testid="error"]'));
    expect(error).toBeNull();
  });
});
```
</details>

---

#  Quiz & Pièges Courants

## ❓ Quiz 1: Trouvez l'erreur

```typescript
it('should add items to array', () => {
  const arr = [1, 2, 3];
  const expected = [1, 2, 3];
  expect(arr).toBe(expected);
});
```

<details>
<summary> Réponse</summary>

**Problème**: `toBe` compare les références, pas les valeurs!

`[1, 2, 3] === [1, 2, 3]` → `false` (deux objets différents en mémoire)

**Solution**: Utiliser `toEqual()` pour les objets/tableaux:
```typescript
expect(arr).toEqual(expected);
```
</details>

---

## ❓ Quiz 2: Pourquoi ça échoue ?

```typescript
it('should find element', () => {
  const component = TestBed.createComponent(MyComponent);
  const btn = component.debugElement.query(By.css('button'));
  expect(btn.nativeElement.textContent).toContain('Click me');
});
```

<details>
<summary> Réponse</summary>

**Problème**: Oubli de `fixture.detectChanges()` !

Le template n'est pas rendu sans détection de changements.

**Solution**:
```typescript
it('should find element', () => {
  const fixture = TestBed.createComponent(MyComponent);
  fixture.detectChanges(); // ✅ Nécessaire!
  const btn = fixture.debugElement.query(By.css('button'));
  expect(btn.nativeElement.textContent).toContain('Click me');
});
```
</details>

---

## ❓ Quiz 3: Quel est le problème ?

```typescript
describe('MyService', () => {
  const service = new MyService(); // ❌
  
  it('test 1', () => {
    service.addItem('a');
    expect(service.items.length).toBe(1);
  });
  
  it('test 2', () => {
    service.addItem('b');
    expect(service.items.length).toBe(1); //  Échoue!
  });
});
```

<details>
<summary> Réponse</summary>

**Problème**: Le service est partagé entre les tests!

Le test 2 commence avec l'état du test 1 (items = ['a']).

**Solution**: Réinitialiser dans `beforeEach`:
```typescript
describe('MyService', () => {
  let service: MyService;
  
  beforeEach(() => {
    service = new MyService(); // ✅ Nouvelle instance à chaque test
  });
  
  it('test 1', () => {
    service.addItem('a');
    expect(service.items.length).toBe(1);
  });
  
  it('test 2', () => {
    service.addItem('b');
    expect(service.items.length).toBe(1); // ✅ Passe!
  });
});
```
</details>

---

## ❓ Quiz 4: Test piège (Niveau Expert)

Ce test passe, mais il a un problème. Lequel ?

```typescript
it('should validate password', () => {
  component.password = '12345';
  component.validatePassword();
  
  expect(component.isValid).toBe(false);
  
  component.password = '123456';
  component.validatePassword();
  
  expect(component.isValid).toBe(true);
});
```

<details>
<summary> Réponse</summary>

**Problème**: Ce test vérifie **deux comportements** différents!

Si la première assertion échoue, on ne sait pas si c'est:
- Le mot de passe court qui est mal validé
- Le mot de passe long qui est mal validé

**Solution**: Un test = Un comportement
```typescript
it('should reject password shorter than 6 characters', () => {
  component.password = '12345';
  component.validatePassword();
  expect(component.isValid).toBe(false);
});

it('should accept password with 6 or more characters', () => {
  component.password = '123456';
  component.validatePassword();
  expect(component.isValid).toBe(true);
});
```
</details>

---

## ❓ Quiz 5: Challenge Final 

Corrigez ce test (plusieurs erreurs):

```typescript
it('user can login', async () => {
  const email = fixture.debugElement.query(By.css('input[type=email]'));
  const password = fixture.debugElement.query(By.css('input[type=password]'));
  
  email.nativeElement.value = 'user@test.com';
  password.nativeElement.value = 'secret';
  
  const loginBtn = fixture.debugElement.query(By.css('button'));
  loginBtn.nativeElement.click();
  
  expect(component.isLoggedIn).toBe(true);
});
```

<details>
<summary> Réponse</summary>

**Erreurs trouvées:**

1. ❌ Pas de `dispatchEvent` après changement de valeur
2. ❌ Pas de `fixture.detectChanges()`
3. ❌ Pas de `await fixture.whenStable()` pour ngModel
4. ❌ Sélecteurs fragiles (pas de data-testid)
5. ❌ Pas d'attente si login est async

**Version corrigée:**
```typescript
it('user can login', async () => {
  // Utiliser data-testid
  const email = fixture.debugElement.query(By.css('[data-testid="email-input"]'));
  const password = fixture.debugElement.query(By.css('[data-testid="password-input"]'));
  
  // Modifier ET déclencher l'événement
  email.nativeElement.value = 'user@test.com';
  email.nativeElement.dispatchEvent(new Event('input'));
  
  password.nativeElement.value = 'secret';
  password.nativeElement.dispatchEvent(new Event('input'));
  
  // Attendre la mise à jour
  fixture.detectChanges();
  await fixture.whenStable();
  
  // Cliquer sur le bouton
  const loginBtn = fixture.debugElement.query(By.css('[data-testid="login-btn"]'));
  loginBtn.nativeElement.click();
  
  // Si login est async, l'attendre
  await component.login();
  fixture.detectChanges();
  
  expect(component.isLoggedIn).toBe(true);
});
```
</details>

---

#  Résumé des Bonnes Pratiques

| ✅ À Faire | ❌ À Éviter |
|-----------|-------------|
| Un test = Un comportement | Tests avec plusieurs assertions non liées |
| Utiliser `data-testid` | Sélecteurs CSS fragiles |
| `beforeEach` pour initialiser | Variables partagées entre tests |
| `fixture.detectChanges()` après changements | Oublier la détection de changements |
| `toEqual` pour objets/tableaux | `toBe` pour objets/tableaux |
| `() => fn()` avec `toThrow` | Appel direct avec `toThrow` |
| `toBeCloseTo` pour décimaux | `toBe` pour nombres décimaux |
| Tests indépendants | Tests qui dépendent de l'ordre |

---

##  Prochaines Étapes

1. **Pratiquer** avec les exercices fournis
2. **Explorer** les composants Counter et LoginForm
3. **Écrire** vos propres tests pour votre code
4. **Lire** la [documentation Vitest](https://vitest.dev/)

**Bon testing! **
