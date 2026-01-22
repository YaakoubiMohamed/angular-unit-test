import { Injectable } from '@angular/core';

/**
 * Catégories de température basées sur les degrés Celsius
 */
export type TemperatureCategory =
  | 'freezing'
  | 'cold'
  | 'moderate'
  | 'warm'
  | 'hot';

/**
 * Constante physique : zéro absolu en Celsius
 */
export const ABSOLUTE_ZERO_CELSIUS = -273.15;

/**
 * Service de conversion de températures
 *
 * Supporte les conversions entre Celsius, Fahrenheit et Kelvin.
 *
 * @example
 * ```typescript
 * const temp = inject(TemperatureService);
 *
 * // Conversions simples
 * temp.celsiusToFahrenheit(0);   // 32
 * temp.fahrenheitToCelsius(98.6); // 37
 *
 * // Catégorisation
 * temp.getTemperatureCategory(25); // 'warm'
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class TemperatureService {
  /**
   * Convertit des degrés Celsius en Fahrenheit
   *
   * Formule : (C × 9/5) + 32
   *
   * @param celsius - Température en Celsius
   * @param decimals - Nombre de décimales (défaut: 2)
   * @returns Température en Fahrenheit
   * @throws Error si la température est en dessous du zéro absolu
   *
   * @example
   * ```typescript
   * celsiusToFahrenheit(0);    // 32
   * celsiusToFahrenheit(100);  // 212
   * celsiusToFahrenheit(-40);  // -40 (point d'intersection)
   * ```
   */
  celsiusToFahrenheit(celsius: number, decimals: number = 2): number {
    this.validateAboveAbsoluteZero(celsius);
    const fahrenheit = (celsius * 9) / 5 + 32;
    return this.roundToDecimals(fahrenheit, decimals);
  }

  /**
   * Convertit des degrés Fahrenheit en Celsius
   *
   * Formule : (F - 32) × 5/9
   *
   * @param fahrenheit - Température en Fahrenheit
   * @param decimals - Nombre de décimales (défaut: 2)
   * @returns Température en Celsius
   * @throws Error si la température est en dessous du zéro absolu
   *
   * @example
   * ```typescript
   * fahrenheitToCelsius(32);    // 0
   * fahrenheitToCelsius(212);   // 100
   * fahrenheitToCelsius(98.6);  // 37 (température corporelle)
   * ```
   */
  fahrenheitToCelsius(fahrenheit: number, decimals: number = 2): number {
    const celsius = ((fahrenheit - 32) * 5) / 9;
    this.validateAboveAbsoluteZero(celsius);
    return this.roundToDecimals(celsius, decimals);
  }

  /**
   * Convertit des degrés Celsius en Kelvin
   *
   * Formule : C + 273.15
   *
   * @param celsius - Température en Celsius
   * @param decimals - Nombre de décimales (défaut: 2)
   * @returns Température en Kelvin
   * @throws Error si la température est en dessous du zéro absolu
   *
   * @example
   * ```typescript
   * celsiusToKelvin(0);      // 273.15
   * celsiusToKelvin(-273.15); // 0 (zéro absolu)
   * ```
   */
  celsiusToKelvin(celsius: number, decimals: number = 2): number {
    this.validateAboveAbsoluteZero(celsius);
    const kelvin = celsius + 273.15;
    return this.roundToDecimals(kelvin, decimals);
  }

  /**
   * Convertit des Kelvin en Celsius
   *
   * Formule : K - 273.15
   *
   * @param kelvin - Température en Kelvin
   * @param decimals - Nombre de décimales (défaut: 2)
   * @returns Température en Celsius
   * @throws Error si la température Kelvin est négative
   */
  kelvinToCelsius(kelvin: number, decimals: number = 2): number {
    if (kelvin < 0) {
      throw new Error(
        'La température en Kelvin ne peut pas être négative'
      );
    }
    const celsius = kelvin - 273.15;
    return this.roundToDecimals(celsius, decimals);
  }

  /**
   * Détermine la catégorie de température en fonction des degrés Celsius
   *
   * - < 0°C : 'freezing' (glacial)
   * - 0-15°C : 'cold' (froid)
   * - 15-25°C : 'moderate' (modéré)
   * - 25-35°C : 'warm' (chaud)
   * - > 35°C : 'hot' (très chaud)
   *
   * @param celsius - Température en Celsius
   * @returns Catégorie de température
   *
   * @example
   * ```typescript
   * getTemperatureCategory(-5);  // 'freezing'
   * getTemperatureCategory(10);  // 'cold'
   * getTemperatureCategory(22);  // 'moderate'
   * getTemperatureCategory(30);  // 'warm'
   * getTemperatureCategory(40);  // 'hot'
   * ```
   */
  getTemperatureCategory(celsius: number): TemperatureCategory {
    if (celsius < 0) {
      return 'freezing';
    }
    if (celsius < 15) {
      return 'cold';
    }
    if (celsius < 25) {
      return 'moderate';
    }
    if (celsius < 35) {
      return 'warm';
    }
    return 'hot';
  }

  /**
   * Vérifie si une température est confortable pour l'humain
   * (entre 18°C et 24°C)
   *
   * @param celsius - Température en Celsius
   * @returns true si la température est confortable
   */
  isComfortableTemperature(celsius: number): boolean {
    return celsius >= 18 && celsius <= 24;
  }

  /**
   * Calcule la différence entre deux températures
   *
   * @param temp1 - Première température en Celsius
   * @param temp2 - Deuxième température en Celsius
   * @returns Différence absolue entre les deux températures
   */
  temperatureDifference(temp1: number, temp2: number): number {
    return Math.abs(temp1 - temp2);
  }

  /**
   * Calcule la température moyenne d'un tableau de températures
   *
   * @param temperatures - Tableau de températures en Celsius
   * @returns Température moyenne
   * @throws Error si le tableau est vide
   */
  averageTemperature(temperatures: number[]): number {
    if (temperatures.length === 0) {
      throw new Error('Le tableau de températures ne peut pas être vide');
    }
    const sum = temperatures.reduce((acc, temp) => acc + temp, 0);
    return this.roundToDecimals(sum / temperatures.length, 2);
  }

  /**
   * Valide qu'une température n'est pas en dessous du zéro absolu
   * @private
   */
  private validateAboveAbsoluteZero(celsius: number): void {
    if (celsius < ABSOLUTE_ZERO_CELSIUS) {
      throw new Error(
        `La température ne peut pas être inférieure au zéro absolu (${ABSOLUTE_ZERO_CELSIUS}°C)`
      );
    }
  }

  /**
   * Arrondit un nombre au nombre de décimales spécifié
   * @private
   */
  private roundToDecimals(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}
