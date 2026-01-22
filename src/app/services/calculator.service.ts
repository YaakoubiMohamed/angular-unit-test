import { Injectable } from '@angular/core';

/**
 * Service de calcul mathématique
 * Fournit des opérations arithmétiques de base
 *
 * @example
 * ```typescript
 * const calc = inject(CalculatorService);
 * const sum = calc.add(5, 3); // 8
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  /**
   * Additionne deux nombres
   * @param a - Premier nombre
   * @param b - Deuxième nombre
   * @returns La somme de a et b
   */
  add(a: number, b: number): number {
    return a + b;
  }

  /**
   * Soustrait b de a
   * @param a - Nombre de départ
   * @param b - Nombre à soustraire
   * @returns La différence a - b
   */
  subtract(a: number, b: number): number {
    return a - b;
  }

  /**
   * Multiplie deux nombres
   * @param a - Premier facteur
   * @param b - Deuxième facteur
   * @returns Le produit de a et b
   */
  multiply(a: number, b: number): number {
    return a * b;
  }

  /**
   * Divise a par b
   * @param a - Dividende
   * @param b - Diviseur
   * @returns Le quotient a / b
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
   * @param value - Valeur de base
   * @param percent - Pourcentage à calculer
   * @returns Le pourcentage de la valeur
   *
   * @example
   * ```typescript
   * calc.percentage(200, 10); // 20 (10% de 200)
   * ```
   */
  percentage(value: number, percent: number): number {
    return (value * percent) / 100;
  }

  /**
   * Calcule la puissance d'un nombre
   * @param base - Nombre de base
   * @param exponent - Exposant
   * @returns base élevé à la puissance exponent
   */
  power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  /**
   * Calcule la racine carrée d'un nombre
   * @param value - Nombre dont on veut la racine carrée
   * @returns La racine carrée de value
   * @throws Error si value est négatif
   */
  squareRoot(value: number): number {
    if (value < 0) {
      throw new Error('Racine carrée d\'un nombre négatif impossible');
    }
    return Math.sqrt(value);
  }
}
