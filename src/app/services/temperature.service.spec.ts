import {
  TemperatureService,
  ABSOLUTE_ZERO_CELSIUS,
} from './temperature.service';

describe('TemperatureService', () => {
  let service: TemperatureService;

  beforeEach(() => {
    service = new TemperatureService();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🚨 SECTION PÉDAGOGIQUE : Erreurs spécifiques aux conversions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('Erreurs de conversion (à décommenter pour apprendre)', () => {
    /*
    // ❌ ERREUR 1 : Confusion des formules de conversion
    // Message: "Expected 50 to be 122"
    // Rappel: C→F = (C × 9/5) + 32, PAS C × 2 + 30 !
    it('ERREUR - mauvaise formule', () => {
      // 50°C devrait donner 122°F, pas autre chose
      const result = service.celsiusToFahrenheit(50);
      expect(result).toBe(130); // ❌ Formule approximative incorrecte
      // ✅ Correct : expect(result).toBe(122);
    });
    */

    /*
    // ❌ ERREUR 2 : Oublier le décalage de 32 pour Fahrenheit
    // Message: "Expected 0 to be 32"
    it('ERREUR - oubli du +32', () => {
      // 0°C = 32°F (point de congélation de l'eau)
      const result = service.celsiusToFahrenheit(0);
      expect(result).toBe(0); // ❌ C'est 32, pas 0 !
    });
    */

    /*
    // ❌ ERREUR 3 : Tester une exception sans fonction fléchée
    // Message: L'exception est levée avant que toThrow puisse la capturer
    it('ERREUR - toThrow sans arrow function', () => {
      // Ceci lève l'exception IMMÉDIATEMENT
      expect(service.celsiusToFahrenheit(-300)).toThrow(); // ❌ BOOM!
      // ✅ Correct : expect(() => service.celsiusToFahrenheit(-300)).toThrow();
    });
    */

    /*
    // ❌ ERREUR 4 : Mauvaise utilisation de toThrowError
    // Message: "Expected function to throw an error matching /message/"
    it('ERREUR - mauvais message d\'erreur', () => {
      expect(() => service.celsiusToFahrenheit(-300))
        .toThrowError('Invalid temperature'); // ❌ Mauvais message
      // ✅ Correct : .toThrowError(/zéro absolu/);
    });
    */

    /*
    // ❌ ERREUR 5 : Confusion Kelvin (jamais négatif !)
    // Message: "Expected function to throw Error"
    it('ERREUR - Kelvin négatif impossible', () => {
      // En physique, les Kelvin ne peuvent PAS être négatifs
      const result = service.kelvinToCelsius(-10);
      expect(result).toBe(-283.15); // ❌ Devrait lever une exception !
    });
    */

    /*
    // ❌ ERREUR 6 : Comparaison de catégories avec mauvaise casse
    // Message: "Expected 'COLD' to be 'cold'"
    it('ERREUR - casse des catégories', () => {
      const category = service.getTemperatureCategory(10);
      expect(category).toBe('COLD'); // ❌ Le service retourne 'cold'
    });
    */

    it('should be a placeholder for error examples', () => {
      expect(true).toBe(true);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌡️ Tests pour celsiusToFahrenheit
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('celsiusToFahrenheit', () => {
    it('should convert 0°C to 32°F (point de congélation)', () => {
      //  Formule : (0 × 9/5) + 32 = 32
      expect(service.celsiusToFahrenheit(0)).toBe(32);
    });

    it('should convert 100°C to 212°F (point d\'ébullition)', () => {
      //  Formule : (100 × 9/5) + 32 = 180 + 32 = 212
      expect(service.celsiusToFahrenheit(100)).toBe(212);
    });

    it('should convert -40°C to -40°F (point d\'intersection)', () => {
      //  C'est le seul point où Celsius = Fahrenheit !
      expect(service.celsiusToFahrenheit(-40)).toBe(-40);
    });

    it('should convert 37°C to 98.6°F (température corporelle)', () => {
      //  Utiliser toBeCloseTo pour les décimales
      expect(service.celsiusToFahrenheit(37)).toBeCloseTo(98.6, 1);
    });

    it('should handle negative temperatures', () => {
      expect(service.celsiusToFahrenheit(-20)).toBe(-4);
    });

    it('should handle decimal temperatures', () => {
      expect(service.celsiusToFahrenheit(20.5)).toBe(68.9);
    });

    it('should respect decimal parameter', () => {
      expect(service.celsiusToFahrenheit(37, 0)).toBe(99);
      expect(service.celsiusToFahrenheit(37, 4)).toBe(98.6);
    });

    it('should throw error for temperature below absolute zero', () => {
      //  TOUJOURS utiliser une fonction fléchée avec toThrow !
      expect(() => service.celsiusToFahrenheit(-300)).toThrowError(
        /zéro absolu/
      );
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌡️ Tests pour fahrenheitToCelsius
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('fahrenheitToCelsius', () => {
    it('should convert 32°F to 0°C', () => {
      expect(service.fahrenheitToCelsius(32)).toBe(0);
    });

    it('should convert 212°F to 100°C', () => {
      expect(service.fahrenheitToCelsius(212)).toBe(100);
    });

    it('should convert 98.6°F to 37°C (température corporelle)', () => {
      expect(service.fahrenheitToCelsius(98.6)).toBe(37);
    });

    it('should convert -40°F to -40°C (point d\'intersection)', () => {
      expect(service.fahrenheitToCelsius(-40)).toBe(-40);
    });

    it('should handle negative Fahrenheit values', () => {
      expect(service.fahrenheitToCelsius(-4)).toBe(-20);
    });

    it('should throw error for temperature below absolute zero', () => {
      expect(() => service.fahrenheitToCelsius(-500)).toThrowError(
        /zéro absolu/
      );
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌡️ Tests pour celsiusToKelvin
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('celsiusToKelvin', () => {
    it('should convert 0°C to 273.15K', () => {
      expect(service.celsiusToKelvin(0)).toBe(273.15);
    });

    it('should convert -273.15°C to 0K (zéro absolu)', () => {
      expect(service.celsiusToKelvin(ABSOLUTE_ZERO_CELSIUS)).toBe(0);
    });

    it('should convert 100°C to 373.15K', () => {
      expect(service.celsiusToKelvin(100)).toBe(373.15);
    });

    it('should handle negative temperatures', () => {
      expect(service.celsiusToKelvin(-50)).toBe(223.15);
    });

    it('should throw error for temperature below absolute zero', () => {
      expect(() => service.celsiusToKelvin(-300)).toThrowError(/zéro absolu/);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌡️ Tests pour kelvinToCelsius
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('kelvinToCelsius', () => {
    it('should convert 273.15K to 0°C', () => {
      expect(service.kelvinToCelsius(273.15)).toBe(0);
    });

    it('should convert 0K to -273.15°C (zéro absolu)', () => {
      expect(service.kelvinToCelsius(0)).toBe(ABSOLUTE_ZERO_CELSIUS);
    });

    it('should convert 373.15K to 100°C', () => {
      expect(service.kelvinToCelsius(373.15)).toBe(100);
    });

    it('should throw error for negative Kelvin', () => {
      expect(() => service.kelvinToCelsius(-10)).toThrowError(
        /Kelvin ne peut pas être négative/
      );
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🏷️ Tests pour getTemperatureCategory
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('getTemperatureCategory', () => {
    describe('freezing (< 0°C)', () => {
      it('should return "freezing" for -10°C', () => {
        expect(service.getTemperatureCategory(-10)).toBe('freezing');
      });

      it('should return "freezing" for -0.1°C', () => {
        expect(service.getTemperatureCategory(-0.1)).toBe('freezing');
      });
    });

    describe('cold (0-15°C)', () => {
      it('should return "cold" for 0°C', () => {
        expect(service.getTemperatureCategory(0)).toBe('cold');
      });

      it('should return "cold" for 10°C', () => {
        expect(service.getTemperatureCategory(10)).toBe('cold');
      });

      it('should return "cold" for 14.9°C', () => {
        expect(service.getTemperatureCategory(14.9)).toBe('cold');
      });
    });

    describe('moderate (15-25°C)', () => {
      it('should return "moderate" for 15°C', () => {
        expect(service.getTemperatureCategory(15)).toBe('moderate');
      });

      it('should return "moderate" for 20°C', () => {
        expect(service.getTemperatureCategory(20)).toBe('moderate');
      });

      it('should return "moderate" for 24.9°C', () => {
        expect(service.getTemperatureCategory(24.9)).toBe('moderate');
      });
    });

    describe('warm (25-35°C)', () => {
      it('should return "warm" for 25°C', () => {
        expect(service.getTemperatureCategory(25)).toBe('warm');
      });

      it('should return "warm" for 30°C', () => {
        expect(service.getTemperatureCategory(30)).toBe('warm');
      });

      it('should return "warm" for 34.9°C', () => {
        expect(service.getTemperatureCategory(34.9)).toBe('warm');
      });
    });

    describe('hot (> 35°C)', () => {
      it('should return "hot" for 35°C', () => {
        expect(service.getTemperatureCategory(35)).toBe('hot');
      });

      it('should return "hot" for 40°C', () => {
        expect(service.getTemperatureCategory(40)).toBe('hot');
      });

      it('should return "hot" for 50°C', () => {
        expect(service.getTemperatureCategory(50)).toBe('hot');
      });
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Tests pour isComfortableTemperature
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('isComfortableTemperature', () => {
    it('should return true for temperatures between 18°C and 24°C', () => {
      expect(service.isComfortableTemperature(18)).toBe(true);
      expect(service.isComfortableTemperature(21)).toBe(true);
      expect(service.isComfortableTemperature(24)).toBe(true);
    });

    it('should return false for temperatures below 18°C', () => {
      expect(service.isComfortableTemperature(17.9)).toBe(false);
      expect(service.isComfortableTemperature(10)).toBe(false);
    });

    it('should return false for temperatures above 24°C', () => {
      expect(service.isComfortableTemperature(24.1)).toBe(false);
      expect(service.isComfortableTemperature(30)).toBe(false);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  Tests pour temperatureDifference
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('temperatureDifference', () => {
    it('should calculate difference correctly', () => {
      expect(service.temperatureDifference(30, 20)).toBe(10);
    });

    it('should return absolute value regardless of order', () => {
      expect(service.temperatureDifference(20, 30)).toBe(10);
    });

    it('should handle negative temperatures', () => {
      expect(service.temperatureDifference(-10, 10)).toBe(20);
    });

    it('should return 0 for same temperatures', () => {
      expect(service.temperatureDifference(25, 25)).toBe(0);
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📈 Tests pour averageTemperature
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  describe('averageTemperature', () => {
    it('should calculate average correctly', () => {
      expect(service.averageTemperature([20, 22, 24])).toBe(22);
    });

    it('should handle single value', () => {
      expect(service.averageTemperature([25])).toBe(25);
    });

    it('should handle decimal results', () => {
      expect(service.averageTemperature([20, 21, 22])).toBe(21);
    });

    it('should handle negative values', () => {
      expect(service.averageTemperature([-10, 0, 10])).toBe(0);
    });

    it('should throw error for empty array', () => {
      expect(() => service.averageTemperature([])).toThrowError(
        /ne peut pas être vide/
      );
    });
  });
});
