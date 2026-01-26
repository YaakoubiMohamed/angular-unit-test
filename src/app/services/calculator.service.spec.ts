import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  //  Initialisation avant chaque test
  beforeEach(() => {
    service = new CalculatorService();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🚨 SECTION PÉDAGOGIQUE : Exemples d'erreurs courantes
  // Décommentez ces tests pour voir les messages d'erreur !
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('Exemples d\'erreurs (à décommenter pour apprendre)', () => {
    /*
    // ❌ ERREUR 1 : Service non initialisé
    // Message: "Cannot read properties of undefined (reading 'add')"
    it('ERREUR - service undefined', () => {
      let uninitializedService: CalculatorService;
      // uninitializedService n'est jamais instancié !
      const result = uninitializedService.add(2, 3);
      expect(result).toBe(5);
    });
    */

    /*
    // ❌ ERREUR 2 : Mauvaise valeur attendue
    // Message: "Expected 8 to be 10"
    it('ERREUR - mauvaise assertion', () => {
      const result = service.add(5, 3);
      expect(result).toBe(10); // 5 + 3 = 8, pas 10 !
    });
    */

    /*
    // ❌ ERREUR 3 : Problème de précision des décimales
    // Message: "Expected 0.30000000000000004 to be 0.3"
    it('ERREUR - précision flottante avec toBe', () => {
      const result = service.add(0.1, 0.2);
      expect(result).toBe(0.3); // Utiliser toBeCloseTo() à la place !
    });
    */

    /*
    // ❌ ERREUR 4 : toThrow sans fonction fléchée
    // Message: L'erreur est levée AVANT que toThrow puisse la capturer
    it('ERREUR - toThrow mal utilisé', () => {
      expect(service.divide(10, 0)).toThrow(); // ❌ Appel direct
      // ✅ Correct : expect(() => service.divide(10, 0)).toThrow();
    });
    */

    /*
    // ❌ ERREUR 5 : Test sans assertion
    // Message: "Spec has no expectations"
    it('ERREUR - pas d\'expect', () => {
      const result = service.add(2, 3);
      console.log('Résultat:', result);
      // Oubli de expect() !
    });
    */

    // ✅ Ce test passe - juste pour montrer que la section fonctionne
    it('should be a placeholder for error examples', () => {
      expect(true).toBe(true);
    });
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
      // ✅ CORRECT : Utiliser toBeCloseTo pour les nombres décimaux
      // ❌ INCORRECT : expect(result).toBe(0.3) échouerait à cause de la précision flottante
      expect(result).toBeCloseTo(0.3);
    });

    it('should handle very large numbers', () => {
      const result = service.add(1000000, 2000000);
      expect(result).toBe(3000000);
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

    it('should return zero when subtracting same numbers', () => {
      expect(service.subtract(5, 5)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(service.subtract(-5, -3)).toBe(-2);
      expect(service.subtract(-5, 3)).toBe(-8);
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
      expect(service.multiply(0, 100)).toBe(0);
    });

    it('should handle negative numbers correctly', () => {
      expect(service.multiply(-4, 5)).toBe(-20);
      expect(service.multiply(-4, -5)).toBe(20);
    });

    it('should return the same number when multiplying by one', () => {
      expect(service.multiply(42, 1)).toBe(42);
    });

    it('should handle decimal multiplication', () => {
      expect(service.multiply(2.5, 4)).toBe(10);
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
      expect(() => service.divide(10, 0)).toThrowError(
        'Division par zéro impossible'
      );
    });

    it('should handle decimal results', () => {
      expect(service.divide(10, 4)).toBe(2.5);
    });

    it('should return zero when dividing zero', () => {
      expect(service.divide(0, 5)).toBe(0);
    });

    it('should handle negative division', () => {
      expect(service.divide(-20, 4)).toBe(-5);
      expect(service.divide(20, -4)).toBe(-5);
      expect(service.divide(-20, -4)).toBe(5);
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

    it('should handle decimal percentages', () => {
      expect(service.percentage(200, 12.5)).toBe(25);
    });

    it('should handle percentage over 100%', () => {
      expect(service.percentage(100, 150)).toBe(150);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Tests pour la puissance
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('power', () => {
    it('should calculate power correctly', () => {
      expect(service.power(2, 3)).toBe(8);
    });

    it('should return 1 when exponent is 0', () => {
      expect(service.power(5, 0)).toBe(1);
    });

    it('should return the base when exponent is 1', () => {
      expect(service.power(7, 1)).toBe(7);
    });

    it('should handle negative exponents', () => {
      expect(service.power(2, -1)).toBe(0.5);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // √ Tests pour la racine carrée
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('squareRoot', () => {
    it('should calculate square root correctly', () => {
      expect(service.squareRoot(16)).toBe(4);
      expect(service.squareRoot(25)).toBe(5);
    });

    it('should return 0 for square root of 0', () => {
      expect(service.squareRoot(0)).toBe(0);
    });

    it('should handle decimal results', () => {
      expect(service.squareRoot(2)).toBeCloseTo(1.414, 3);
    });

    it('should throw error for negative numbers', () => {
      expect(() => service.squareRoot(-4)).toThrowError(
        "Racine carrée d'un nombre négatif impossible"
      );
    });
  });
});
