import { Injectable } from '@angular/core';

/**
 * Résultat détaillé d'un calcul de réduction
 */
export interface DiscountResult {
  /** Prix original avant réduction */
  originalPrice: number;
  /** Pourcentage de réduction appliqué */
  discountPercent: number;
  /** Montant de la réduction en euros */
  discountAmount: number;
  /** Prix final après réduction */
  finalPrice: number;
}

/**
 * Configuration d'un code promo
 */
interface PromoCodeConfig {
  /** Pourcentage de réduction */
  discount: number;
  /** Date d'expiration (optionnelle) */
  expiresAt?: Date;
  /** Montant minimum de commande */
  minOrderAmount?: number;
}

/**
 * Service de gestion des réductions et codes promo
 *
 * @example
 * ```typescript
 * const discount = inject(DiscountService);
 *
 * // Appliquer une réduction simple
 * const finalPrice = discount.applyDiscount(100, 20); // 80€
 *
 * // Vérifier un code promo
 * if (discount.isValidPromoCode('PROMO10')) {
 *   const percent = discount.getDiscountForCode('PROMO10');
 *   // ...
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  /** Base de données des codes promo valides */
  private readonly promoCodes: Record<string, PromoCodeConfig> = {
    PROMO10: { discount: 10 },
    PROMO20: { discount: 20 },
    SUMMER50: { discount: 50, minOrderAmount: 100 },
    VIP: { discount: 30 },
    WELCOME: { discount: 15, minOrderAmount: 50 },
  };

  /**
   * Applique une réduction sur un prix
   *
   * @param price - Prix original (doit être positif ou nul)
   * @param discountPercent - Pourcentage de réduction (0-100)
   * @returns Le prix après réduction
   *
   * @remarks
   * - Si le prix est négatif, retourne 0
   * - Si le pourcentage est invalide (<0 ou >100), retourne le prix original
   *
   * @example
   * ```typescript
   * applyDiscount(200, 10);  // 180
   * applyDiscount(100, 50);  // 50
   * applyDiscount(200, 150); // 200 (invalide)
   * ```
   */
  applyDiscount(price: number, discountPercent: number): number {
    // Validation du prix
    if (price < 0) {
      return 0;
    }

    // Validation du pourcentage
    if (discountPercent < 0 || discountPercent > 100) {
      return price;
    }

    const discountAmount = (price * discountPercent) / 100;
    return price - discountAmount;
  }

  /**
   * Calcule les détails complets d'une réduction
   *
   * @param price - Prix original
   * @param discountPercent - Pourcentage de réduction
   * @returns Objet contenant tous les détails de la réduction
   */
  calculateDiscountDetails(
    price: number,
    discountPercent: number
  ): DiscountResult {
    const finalPrice = this.applyDiscount(price, discountPercent);
    const discountAmount = price - finalPrice;

    return {
      originalPrice: price,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      finalPrice: finalPrice,
    };
  }

  /**
   * Vérifie si un code promo est valide
   *
   * @param code - Code promo à vérifier (insensible à la casse)
   * @returns true si le code est valide, false sinon
   */
  isValidPromoCode(code: string): boolean {
    if (!code || code.trim() === '') {
      return false;
    }
    return code.toUpperCase() in this.promoCodes;
  }

  /**
   * Retourne le pourcentage de réduction pour un code promo
   *
   * @param code - Code promo (insensible à la casse)
   * @returns Pourcentage de réduction, ou 0 si le code est invalide
   */
  getDiscountForCode(code: string): number {
    if (!code) {
      return 0;
    }
    return this.promoCodes[code.toUpperCase()]?.discount ?? 0;
  }

  /**
   * Récupère le montant minimum de commande pour un code promo
   *
   * @param code - Code promo
   * @returns Montant minimum requis, ou 0 si pas de minimum
   */
  getMinOrderAmountForCode(code: string): number {
    if (!code) {
      return 0;
    }
    return this.promoCodes[code.toUpperCase()]?.minOrderAmount ?? 0;
  }

  /**
   * Vérifie si un code promo peut être appliqué à une commande
   *
   * @param code - Code promo
   * @param orderAmount - Montant de la commande
   * @returns true si le code peut être appliqué
   */
  canApplyPromoCode(code: string, orderAmount: number): boolean {
    if (!this.isValidPromoCode(code)) {
      return false;
    }

    const minAmount = this.getMinOrderAmountForCode(code);
    return orderAmount >= minAmount;
  }

  /**
   * Applique un code promo à un montant de commande
   *
   * @param code - Code promo
   * @param orderAmount - Montant de la commande
   * @returns Prix final après application du code, ou le montant original si invalide
   */
  applyPromoCode(code: string, orderAmount: number): number {
    if (!this.canApplyPromoCode(code, orderAmount)) {
      return orderAmount;
    }

    const discountPercent = this.getDiscountForCode(code);
    return this.applyDiscount(orderAmount, discountPercent);
  }

  /**
   * Calcule la réduction progressive basée sur le montant
   * - < 50€ : pas de réduction
   * - 50-100€ : 5% de réduction
   * - 100-200€ : 10% de réduction
   * - > 200€ : 15% de réduction
   *
   * @param amount - Montant de la commande
   * @returns Pourcentage de réduction applicable
   */
  getProgressiveDiscount(amount: number): number {
    if (amount < 50) {
      return 0;
    }
    if (amount < 100) {
      return 5;
    }
    if (amount < 200) {
      return 10;
    }
    return 15;
  }
}
