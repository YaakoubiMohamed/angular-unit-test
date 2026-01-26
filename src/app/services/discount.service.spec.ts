import { DiscountService, DiscountResult } from './discount.service';

describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(() => {
    service = new DiscountService();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🚨 SECTION PÉDAGOGIQUE : Erreurs fréquentes avec les services
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('Erreurs courantes (à décommenter pour apprendre)', () => {
    /*
    // ❌ ERREUR 1 : Confusion entre le prix original et le prix réduit
    // Message: "Expected 180 to be 200"
    // Explication: Après 10% de réduction, 200€ devient 180€, pas 200€ !
    it('ERREUR - confusion prix original/réduit', () => {
      const result = service.applyDiscount(200, 10);
      expect(result).toBe(200); // ❌ Mauvaise valeur
      // ✅ Correct : expect(result).toBe(180);
    });
    */

    /*
    // ❌ ERREUR 2 : Comparaison d'objets avec toBe au lieu de toEqual
    // Message: "Expected object to be object" (comparaison de référence)
    it('ERREUR - toBe vs toEqual pour objets', () => {
      const result = service.calculateDiscountDetails(100, 10);
      expect(result).toBe({
        originalPrice: 100,
        discountPercent: 10,
        discountAmount: 10,
        finalPrice: 90
      }); // ❌ toBe compare les références, pas les valeurs !
      // ✅ Correct : expect(result).toEqual({...});
    });
    */

    /*
    // ❌ ERREUR 3 : Oublier la casse dans les comparaisons de chaînes
    // Message: "Expected false to be true"
    it('ERREUR - sensibilité à la casse', () => {
      // Le service gère la casse, mais si on compare directement...
      const code = 'promo10';
      expect(code === 'PROMO10').toBe(true); // ❌ Échoue !
      // ✅ Correct : expect(code.toUpperCase() === 'PROMO10').toBe(true);
    });
    */

    /*
    // ❌ ERREUR 4 : Tester le comportement d'Angular au lieu du service
    // Ce test ne vérifie rien d'utile !
    it('ERREUR - test inutile', () => {
      expect(service).toBeDefined();
      expect(service).toBeTruthy();
      // ❌ Cela teste que Angular fonctionne, pas VOTRE logique !
    });
    */

    /*
    // ❌ ERREUR 5 : Oublier les cas limites
    // Ce test passe mais ne teste pas assez de scénarios
    it('ERREUR - test incomplet', () => {
      expect(service.applyDiscount(100, 10)).toBe(90);
      // ❌ Que se passe-t-il avec :
      // - Un prix négatif ?
      // - Un pourcentage > 100 ?
      // - Un pourcentage négatif ?
      // - Des décimales ?
    });
    */

    it('should be a placeholder for error examples', () => {
      expect(true).toBe(true);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 💰 Tests pour applyDiscount
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('applyDiscount', () => {
    describe('avec des paramètres valides', () => {
      it('should apply 10% discount correctly', () => {
        const result = service.applyDiscount(200, 10);
        //  Note : 200 - (200 × 10 / 100) = 200 - 20 = 180
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
        //  Note : Utiliser toBeCloseTo pour les décimales !
        expect(result).toBeCloseTo(89.991, 2);
      });

      it('should handle small decimal percentages', () => {
        const result = service.applyDiscount(100, 0.5);
        expect(result).toBe(99.5);
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

      it('should handle zero price', () => {
        const result = service.applyDiscount(0, 50);
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
        finalPrice: 180,
      });
    });

    it('should calculate zero discount amount for 0%', () => {
      const result = service.calculateDiscountDetails(100, 0);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(100);
    });

    it('should handle full discount correctly', () => {
      const result = service.calculateDiscountDetails(150, 100);
      expect(result.discountAmount).toBe(150);
      expect(result.finalPrice).toBe(0);
    });

    it('should preserve original price in result', () => {
      const result = service.calculateDiscountDetails(99.99, 25);
      expect(result.originalPrice).toBe(99.99);
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
      expect(service.isValidPromoCode('WELCOME')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(service.isValidPromoCode('promo10')).toBe(true);
      expect(service.isValidPromoCode('Promo10')).toBe(true);
      expect(service.isValidPromoCode('pRoMo10')).toBe(true);
    });

    it('should return false for invalid promo codes', () => {
      expect(service.isValidPromoCode('INVALID')).toBe(false);
      expect(service.isValidPromoCode('PROMO30')).toBe(false);
      expect(service.isValidPromoCode('DISCOUNT')).toBe(false);
    });

    it('should return false for empty or whitespace codes', () => {
      expect(service.isValidPromoCode('')).toBe(false);
      expect(service.isValidPromoCode('   ')).toBe(false);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Tests pour getDiscountForCode
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('getDiscountForCode', () => {
    it('should return correct discount for PROMO10', () => {
      expect(service.getDiscountForCode('PROMO10')).toBe(10);
    });

    it('should return correct discount for PROMO20', () => {
      expect(service.getDiscountForCode('PROMO20')).toBe(20);
    });

    it('should return correct discount for VIP', () => {
      expect(service.getDiscountForCode('VIP')).toBe(30);
    });

    it('should return correct discount for SUMMER50', () => {
      expect(service.getDiscountForCode('SUMMER50')).toBe(50);
    });

    it('should return 0 for invalid codes', () => {
      expect(service.getDiscountForCode('INVALID')).toBe(0);
      expect(service.getDiscountForCode('FAKE')).toBe(0);
    });

    it('should be case insensitive', () => {
      expect(service.getDiscountForCode('promo20')).toBe(20);
      expect(service.getDiscountForCode('vip')).toBe(30);
    });

    it('should return 0 for empty string', () => {
      expect(service.getDiscountForCode('')).toBe(0);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Tests pour getMinOrderAmountForCode
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('getMinOrderAmountForCode', () => {
    it('should return minimum order amount for SUMMER50', () => {
      expect(service.getMinOrderAmountForCode('SUMMER50')).toBe(100);
    });

    it('should return minimum order amount for WELCOME', () => {
      expect(service.getMinOrderAmountForCode('WELCOME')).toBe(50);
    });

    it('should return 0 for codes without minimum', () => {
      expect(service.getMinOrderAmountForCode('PROMO10')).toBe(0);
      expect(service.getMinOrderAmountForCode('VIP')).toBe(0);
    });

    it('should return 0 for invalid codes', () => {
      expect(service.getMinOrderAmountForCode('INVALID')).toBe(0);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✅ Tests pour canApplyPromoCode
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('canApplyPromoCode', () => {
    it('should return true when order meets minimum amount', () => {
      expect(service.canApplyPromoCode('SUMMER50', 150)).toBe(true);
      expect(service.canApplyPromoCode('WELCOME', 75)).toBe(true);
    });

    it('should return true for codes without minimum', () => {
      expect(service.canApplyPromoCode('PROMO10', 10)).toBe(true);
      expect(service.canApplyPromoCode('VIP', 1)).toBe(true);
    });

    it('should return false when order is below minimum', () => {
      expect(service.canApplyPromoCode('SUMMER50', 50)).toBe(false);
      expect(service.canApplyPromoCode('WELCOME', 30)).toBe(false);
    });

    it('should return true when order equals minimum', () => {
      expect(service.canApplyPromoCode('SUMMER50', 100)).toBe(true);
      expect(service.canApplyPromoCode('WELCOME', 50)).toBe(true);
    });

    it('should return false for invalid codes', () => {
      expect(service.canApplyPromoCode('INVALID', 1000)).toBe(false);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎁 Tests pour applyPromoCode
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('applyPromoCode', () => {
    it('should apply promo code discount correctly', () => {
      expect(service.applyPromoCode('PROMO10', 100)).toBe(90);
      expect(service.applyPromoCode('PROMO20', 100)).toBe(80);
    });

    it('should not apply code if order is below minimum', () => {
      expect(service.applyPromoCode('SUMMER50', 50)).toBe(50);
    });

    it('should apply code when order meets minimum', () => {
      expect(service.applyPromoCode('SUMMER50', 100)).toBe(50);
    });

    it('should return original amount for invalid codes', () => {
      expect(service.applyPromoCode('INVALID', 100)).toBe(100);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📈 Tests pour getProgressiveDiscount
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('getProgressiveDiscount', () => {
    it('should return 0% for orders under 50€', () => {
      expect(service.getProgressiveDiscount(0)).toBe(0);
      expect(service.getProgressiveDiscount(25)).toBe(0);
      expect(service.getProgressiveDiscount(49.99)).toBe(0);
    });

    it('should return 5% for orders between 50€ and 100€', () => {
      expect(service.getProgressiveDiscount(50)).toBe(5);
      expect(service.getProgressiveDiscount(75)).toBe(5);
      expect(service.getProgressiveDiscount(99.99)).toBe(5);
    });

    it('should return 10% for orders between 100€ and 200€', () => {
      expect(service.getProgressiveDiscount(100)).toBe(10);
      expect(service.getProgressiveDiscount(150)).toBe(10);
      expect(service.getProgressiveDiscount(199.99)).toBe(10);
    });

    it('should return 15% for orders over 200€', () => {
      expect(service.getProgressiveDiscount(200)).toBe(15);
      expect(service.getProgressiveDiscount(500)).toBe(15);
      expect(service.getProgressiveDiscount(1000)).toBe(15);
    });
  });
});
