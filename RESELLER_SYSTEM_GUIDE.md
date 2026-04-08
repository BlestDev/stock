# Guide complet du système de revendeurs - Stock Pro

## Table des matières

1. [Concepts fondamentaux](#concepts-fondamentaux)
2. [Architecture du système](#architecture-du-système)
3. [Workflow complet](#workflow-complet)
4. [Exemples pratiques](#exemples-pratiques)
5. [Gestion des soldes](#gestion-des-soldes)
6. [Réconciliation et audit](#réconciliation-et-audit)
7. [FAQ du système revendeur](#faq-du-système-revendeur)

---

## Concepts fondamentaux

### Qu'est-ce qu'un revendeur?

Un **revendeur** est une personne ou une entreprise qui vend vos produits en son nom propre, sans paiement immédiat. Vous lui donnez les produits **en consignation** (dépôt), et il vous paie seulement quand il a vendu.

### Exemple concret

Vous êtes chocolatier:
- Vous avez 100 chocolats en stock
- Vous donnez 50 chocolats à un magasin revendeur
- Le magasin les vend à ses clients
- Il vous paye seulement pour ce qu'il a vendu

### Avantages du système de consignation

✓ **Pour vous (le fournisseur):**
- Pas de crédit à accorder
- Pas de risque de non-paiement
- Vous gardez le contrôle des prix
- Vous pouvez augmenter votre distribution

✓ **Pour le revendeur:**
- Pas de capital initial
- Flexibilité: vend ce qu'il peut
- Paie seulement ce qu'il a vendu

---

## Architecture du système

### Entités principales

```
┌─────────────────┐
│   Vous (Vendeur) │
│    (Fournisseur) │
└────────┬────────┘
         │
         │ Donne en consignation
         │ (Produits non payés)
         ↓
┌──────────────────────┐
│  Revendeur (Client)  │
│  Magasin, Boutique   │
└──────────┬───────────┘
           │
           │ Vend aux clients finaux
           │ Vous paie ce qui a été vendu
           ↓
┌─────────────────┐
│  Clients finaux │
│  Consommateurs  │
└─────────────────┘
```

### Deux modes de vente différents

```
MODE NORMAL (Client régulier):
Vous → Vente directe → Client régulier
(Paiement immédiat ou facture)

MODE CONSIGNATION (Revendeur):
Vous → Consigne produits → Revendeur → Vend → Vous paie
(Paiement seulement si vendu)
```

### Tables impliquées

```
reseller_clients          reseller_sales
    │                          │
    │ 1:n                      │ n:1
    └──→ consignments ←────────┘
         │
         │ Liens vers:
         ├─→ products (produit consigné)
         └─→ reseller_clients (revendeur)

         │
         ↓ Génère automatiquement:
    reseller_journals
         │
         └─→ Historique complet par produit
```

---

## Workflow complet

### Étape 1: Créer un revendeur

```
Revendeurs → Nouveau revendeur

Informations:
├─ Nom: "Magasin X"
├─ Email: contact@magasinx.com
├─ Téléphone: +33 6 12 34 56 78
├─ Adresse: "123 Rue principale, 75000 Paris"
└─ Limite de crédit: 10 000 €
    (Montant maximal pouvant être consigné simultanément)

Résultat:
└─ Revendeur créé avec solde initial = 0 €
```

### Étape 2: Consigner des produits

```
Consignations → Nouvelle consignation

Données:
├─ Revendeur: "Magasin X"
├─ Date: 01/04/2024
├─ Produits:
│  ├─ Produit A: 50 unités × 10 € = 500 €
│  └─ Produit B: 30 unités × 20 € = 600 €
└─ Montant total: 1 100 €

Résultat immédiat:
├─ consignments table:
│  ├─ Produit A: 50 unités réservées
│  └─ Produit B: 30 unités réservées
├─ reseller_clients.current_balance:
│  └─ Magasin X: +1 100 € (DOIT 1 100 €)
└─ reseller_journals:
   └─ Entrée: "Consignation: Produit A (50), Produit B (30)"
```

**Important:** Le stock réel NE change pas (produits restent en votre possession)

### Étape 3: Revendeur vend aux clients finaux

Deux façons d'enregistrer:

#### 3A: Via "Paiements Revendeurs" → Enregistrer une vente

```
Paiements Revendeurs → Enregistrer une vente

Données:
├─ Revendeur: "Magasin X"
├─ Date: 05/04/2024
├─ Produits vendus:
│  ├─ Produit A: 20 unités × 10 € = 200 €
│  └─ Produit B: 10 unités × 20 € = 200 €
└─ Montant total: 400 €

Résultat:
├─ reseller_sales:
│  └─ Nouvelle vente enregistrée (400 €)
├─ consignments:
│  ├─ Produit A: quantity_sold += 20
│  └─ Produit B: quantity_sold += 10
├─ reseller_clients.current_balance:
│  └─ Magasin X: 1 100 - 400 = 700 € (DOIT 700 €)
└─ reseller_journals:
   └─ Entrée: "Vente: Produit A (20), Produit B (10) = 400 €"
```

### Étape 4: Revendeur paie

```
Paiements Revendeurs → Enregistrer un paiement

Données:
├─ Revendeur: "Magasin X"
├─ Date: 10/04/2024
├─ Montant payé: 700 €
├─ Méthode: Virement bancaire
└─ Notes: "Virement du 10/04"

Résultat:
├─ reseller_clients.current_balance:
│  └─ Magasin X: 700 - 700 = 0 € (SOLDE RÉGLÉ)
├─ consignment_balances:
│  └─ Magasin X: amount_paid += 700 €
└─ reseller_journals:
   └─ Entrée: "Paiement: 700 € reçu"
```

### Résumé du cycle complet

```
TIMELINE:

01/04 → Consignation
└─ Magasin X reçoit: 50 x Produit A + 30 x Produit B
└─ Solde: 1 100 € (dû par le revendeur)

05/04 → Vente partielle
└─ Magasin X a vendu: 20 x Produit A + 10 x Produit B
└─ Solde: 700 € (dû par le revendeur)

10/04 → Paiement
└─ Magasin X paie: 700 €
└─ Solde: 0 € (Réglé)

À la fin:
├─ Vous avez reçu: 700 € (pour ce qui a été vendu)
├─ Magasin garde les invendus:
│  ├─ Produit A: 30 unités (50 - 20 vendues)
│  └─ Produit B: 20 unités (30 - 10 vendues)
└─ Ces invendus restent à consigner jusqu'à retour/reprise
```

---

## Exemples pratiques

### Exemple 1: Consignation simple - Boisson énergétique

**Contexte:** Vous êtes distributeur de boissons. Un petit épicerie veut vendre vos produits.

**Étape 1: Créer le revendeur**
```
Nom: Épicerie du Coin
Email: contact@epicerie.local
Téléphone: 06 12 34 56 78
Limite crédit: 2 000 €
```

**Étape 2: Consigner**
```
Date: 15/03/2024
Produit: "Boisson X" (0.5L canette)
Quantité: 200 canettes
Prix consignation: 0.75 € par canette
Montant: 200 × 0.75 = 150 €

Épicerie doit: 150 €
Solde: 150 €
```

**Étape 3: Suivi des ventes**

Jour 1: Revendeur vend 50 canettes
```
Vente enregistrée: 50 × 0.75 = 37.50 €
Solde restant: 150 - 37.50 = 112.50 €
```

Jour 5: Revendeur vend 75 canettes supplémentaires
```
Vente enregistrée: 75 × 0.75 = 56.25 €
Solde restant: 112.50 - 56.25 = 56.25 €
```

Jour 10: Revendeur paie 112.50 €
```
Paiement enregistré: 112.50 €
Solde: 56.25 - 112.50 = Crédit de -56.25 €
```

**Étape 4: Récupération des invendus**
```
Canettes vendues: 50 + 75 = 125
Canettes consignées: 200
Canettes restantes: 200 - 125 = 75

Vous pouvez:
1. Demander leur retour
2. Les laisser en consignation
3. Les créditer au prochain cycle
```

---

### Exemple 2: Consignation multiple - Produits électroniques

**Contexte:** Vous vendez des smartphones. Une boutique en veut plusieurs marques.

**Étape 1: Créer le revendeur**
```
Nom: Boutique Télécom Plus
Email: contact@telecomplus.fr
Limite crédit: 50 000 €
```

**Étape 2: Consignation initiale**
```
Date: 01/04/2024

Produit 1: "Smartphone A" (200 €)
├─ Quantité: 10 unités
└─ Montant: 2 000 €

Produit 2: "Smartphone B" (300 €)
├─ Quantité: 8 unités
└─ Montant: 2 400 €

Produit 3: "Coque de protection" (15 €)
├─ Quantité: 50 unités
└─ Montant: 750 €

Total consigné: 5 150 €
Solde boutique: 5 150 €
```

**Étape 3: Journal détaillé**

Après un mois, accédez à "Journal Revendeur":

```
BOUTIQUE TÉLÉCOM PLUS - JOURNAL AVRIL 2024

Produit 1: Smartphone A (200 €)
├─ Consigné: 10 unités (2 000 €)
├─ Vendu: 7 unités (1 400 €)
├─ Restant: 3 unités (600 €)
└─ Solde pour ce produit: 600 €

Produit 2: Smartphone B (300 €)
├─ Consigné: 8 unités (2 400 €)
├─ Vendu: 5 unités (1 500 €)
├─ Restant: 3 unités (900 €)
└─ Solde pour ce produit: 900 €

Produit 3: Coque (15 €)
├─ Consigné: 50 unités (750 €)
├─ Vendu: 45 unités (675 €)
├─ Restant: 5 unités (75 €)
└─ Solde pour ce produit: 75 €

─────────────────
RÉSUMÉ:
├─ Total consigné: 5 150 €
├─ Total vendu: 3 575 € (69% - bonne performance!)
├─ Total invendu: 1 575 €
└─ Solde actuel: 1 575 €
```

**Étape 4: Paiement progressif**

```
05/04 → Paiement: 1 000 € (première tranche)
├─ Solde avant: 5 150 €
└─ Solde après: 4 150 €

15/04 → Paiement: 2 575 € (ventes du mois)
├─ Solde avant: 4 150 €
└─ Solde après: 1 575 €

30/04 → Retour invendus: 3 unités Smartphone A
├─ Crédit: 600 € (3 × 200 €)
├─ Solde avant: 1 575 €
└─ Solde après: 975 € (invendus restants)
```

---

## Gestion des soldes

### Formule du solde

```
SOLDE ACTUEL = Σ Consignations - Σ Ventes - Σ Paiements + Σ Crédits

Ou plus simplement:
SOLDE = Ce que le revendeur DOIT vous

Exemple:
├─ Consignation 1: + 1 000 € (doit vous ça)
├─ Consignation 2: + 500 € (doit vous ça aussi)
├─ Vente 1: - 300 € (a vendu pour 300 €, doit moins)
├─ Paiement 1: - 700 € (a payé 700 €, doit moins)
└─ Solde final: 1 000 + 500 - 300 - 700 = 500 €
```

### États du solde

```
SOLDE > 0 (Positif)
└─ Revendeur DOIT vous de l'argent
   ├─ Cas normal: a reçu plus en consignation qu'il n'a payé
   └─ Action: Relancer pour paiement

SOLDE = 0 (Zéro)
└─ Compte équilibré
   ├─ Cas: Ventes + Paiements = Consignations
   └─ Action: Aucune (compte régularisé)

SOLDE < 0 (Négatif)
└─ Vous DEVEZ au revendeur de l'argent
   ├─ Cas: A vendu plus que consigné
   └─ Action: Lui rembourser ou créditer consignation

Exemple SOLDE NÉGATIF:
├─ Consigné: 500 € (50 articles)
├─ Vendu: 80 articles (valeur: 800 €)
├─ Paiement reçu: 1 000 €
└─ Solde: 500 - 800 - 1 000 = -1 300 € (vous lui devez !)
```

### Limite de crédit

```
LIMITE CRÉDIT = Montant maximum pouvant être consigné

Exemple:
├─ Limite crédit: 5 000 €
├─ Consigné actuellement: 4 500 €
└─ Peut consigner: 500 € max

Vérification avant consignation:
IF (Consigné + Nouvelle consignation) > Limite
  ALORS Message d'erreur
  SINON Accepter
```

---

## Réconciliation et audit

### Journal revendeur expliqué

Le **Journal Revendeur** est votre outil d'audit et de réconciliation.

```
JOURNAL REVENDEUR

Colonnes:
├─ Date: Quand est survenu le mouvement
├─ Type: Consignation / Vente / Paiement
├─ Produit: Quel produit concerne ce mouvement
├─ Quantité: Combien d'unités
├─ Montant: Valeur en euros
├─ Description: Détails supplémentaires
└─ Solde après: Solde du revendeur après ce mouvement

Mouvements enregistrés:
├─ Chaque consignation
├─ Chaque vente par le revendeur
├─ Chaque paiement du revendeur
└─ Chaque remboursement/crédit
```

### Exemple de journal détaillé

```
MAGASIN X - JOURNAL COMPLET

01/04 | Consignation | Produit A | 50 unités | 500 € | Livraison initiale | Solde: 500 €
01/04 | Consignation | Produit B | 30 unités | 600 € | Livraison initiale | Solde: 1 100 €
03/04 | Vente        | Produit A | 20 unités | 200 € | Ventes du 03/04    | Solde: 900 €
05/04 | Vente        | Produit B | 15 unités | 300 € | Ventes du 05/04    | Solde: 600 €
10/04 | Paiement     | Espèces  | -         | 600 € | Visite du gérant   | Solde: 0 €
15/04 | Consignation | Produit C | 40 unités | 800 € | Nouvelle gamme     | Solde: 800 €
18/04 | Vente        | Produit C | 25 unités | 500 € | Ventes du 18/04    | Solde: 300 €
20/04 | Retour       | Produit C | 15 unités | 300 € | Invendus retournés | Solde: 0 €
```

### Réconciliation étape par étape

```
COMMENT RÉCONCILIER AVEC LE REVENDEUR?

1. Imprimer le journal:
   Journal Revendeur → Sélectionner revendeur → Imprimer

2. Envoyer au revendeur pour accord:
   "Voici nos transactions du mois"

3. Comparer les chiffres:
   ├─ Montant total consigné (accord?)
   ├─ Montant total vendu (accord?)
   ├─ Montant total payé (accord?)
   └─ Solde final (accord?)

4. Signer mutuellement:
   "Approuvé par les deux parties"

5. Archiver:
   Garder les journaux pour audit/légal
```

### Vérification d'intégrité

```
FORMULE DE VÉRIFICATION:

Consigné - Vendu - Payé + Crédits = Solde

Si la formule ne correspond pas, il y a une erreur.

Exemple:
├─ Consigné: 5 150 € ✓
├─ Vendu: 3 575 € ✓
├─ Payé: 1 575 € ✓
├─ Crédits: 0 € ✓
└─ Calcul: 5 150 - 3 575 - 1 575 + 0 = 0 € ✓
│
└─ Solde affiché: 0 € ✓ CORRECT!
```

---

## FAQ du système revendeur

### Q: Quelle est la différence entre consignation et crédit?

**Consignation:**
- Vous donnez des produits physiques
- Revendeur DOIT les vendre ou les rendre
- Risque: invendus perdus

**Crédit:**
- Vous laissez un montant comme avance
- Revendeur l'utilise pour acheter
- Risque: il dépense plus que remboursement

**Stock Pro utilise:** Consignation (meilleure sécurité)

---

### Q: Que se passe-t-il si le revendeur vend moins que consigné?

**Scénario:**
```
Consigné: 100 unités (1 000 €)
Vendu: 60 unités (600 €)
Invendus: 40 unités (400 €)

Options:
1. Reprise: Récupérer les 40 unités
   └─ Lui créditer 400 €

2. Stockage prolongé: Laisser en consignation
   └─ Solde reste à 400 €

3. Démarque: Le créditer comme cadeau
   └─ Lui créditer 400 € sans retour produit

4. Rabais: Réduire le prix pour inciter vente
   └─ Modifier solde manuellement
```

---

### Q: Peut-on consigner plusieurs fois au même revendeur?

**OUI, absolument!**

```
01/04 → Consignation 1: 1 000 €
│       Solde: 1 000 €
│
05/04 → Vente: 400 €
│       Solde: 600 €
│
08/04 → Consignation 2: 500 € (nouvelle livraison)
│       Solde: 1 100 € (600 + 500)
│
10/04 → Vente: 300 €
│       Solde: 800 €
│
15/04 → Paiement: 800 €
        Solde: 0 €
```

Les consignations s'ajoutent. C'est normal!

---

### Q: Que se passe-t-il si le revendeur paie trop?

**Exemple:**
```
Solde dû: 500 €
Revendeur paie: 600 €
Résultat: Solde = -100 € (CRÉDIT)
```

**Interprétations:**
1. **Erreur de paie:** Lui rembourser 100 €
2. **Avance:**  Créditer pour prochaines consignations
3. **Acompte:** Sur futures factures

Vous décidez!

---

### Q: Comment gérer les retours/reprises?

**Processus:**

```
1. Revendeur signale retour:
   "Je retire 10 unités du Produit A"

2. Vous le créditez:
   Paiement Revendeurs → Enregistrer paiement

   Type: "Retour marchandise"
   Montant: 10 × 50 € = 500 €

3. Stock réintégré:
   Si produit restituable, ajouter à votre stock

4. Journal mis à jour:
   Historique complet du retour
```

---

### Q: Les revendeurs sont-ils isolés entre eux?

**OUI, complètement isolés!**

```
Revendeur A:
├─ Ses consignations
├─ Ses ventes
├─ Son solde
└─ Son journal

Revendeur B:
├─ Ses consignations
├─ Ses ventes
├─ Son solde
└─ Son journal

Les données de A et B ne se mélangent JAMAIS.
```

Ceci est assuré par Row Level Security (RLS).

---

### Q: Puis-je modifier une consignation après coup?

**Non, par design.**

Les consignations sont immuables pour audit.

**Si erreur:**
```
Option 1: Créer une consignation de correction
├─ Consignation supplémentaire: -50 € (montant négatif?)
│ Non, Stock Pro n'accepte pas les montants négatifs
│
Option 2: Créer un paiement de correction
├─ Enregistrer un paiement: Montant erroné - Montant correct
└─ Journal montre la correction
```

---

### Q: Comment imprimer le journal revendeur?

```
1. Journal Revendeur
2. Sélectionner le revendeur
3. Bouton "Imprimer le journal"
4. Aperçu généré
5. Imprimer (Ctrl+P) ou enregistrer PDF
```

Le journal inclut:
- Nom revendeur et période
- Tableau par produit
- Tableau détaillé chronologique
- Totaux et solde final

---

### Q: Quelle est la meilleure fréquence de règlement?

**Dépend de votre accord:**

```
Weekly (Hebdomadaire):
├─ Avantages: Cash flow rapide, moins de soldes élevés
└─ Inconvénients: Plus de transactions, plus d'administratif

Bi-weekly (Bi-hebdomadaire):
├─ Avantages: Bon compromis
└─ Inconvénients: Moyen terme

Monthly (Mensuel):
├─ Avantages: Moins de transactions, standard commercial
└─ Inconvénients: Soldes élevés, risque crédit

À définir avec chaque revendeur dans:
Revendeurs → Détails → Conditions commerciales (futur)
```

---

### Q: Comment éviter les impayés?

```
PRÉVENTION:

1. Limite crédit bien calibrée:
   ├─ Ne pas trop élevée (limite dépense)
   └─ Réaliste (permet développement)

2. Suivi proactif:
   ├─ Vérifier soldes tous les jours
   ├─ Alertes si >X jours sans paiement
   └─ Relancer rapidement

3. Rapports réguliers:
   ├─ Envoyer journal mensuel
   ├─ Demander accord
   └─ Signer mutuellement

4. Conditions claires:
   ├─ Délai paiement: 30j, 45j, 60j?
   ├─ Frais retard: 5% après délai?
   └─ Clause: Rewindler doit rembourser invendus

5. Documentation:
   ├─ Contrat de consignation signé
   ├─ Conditions générales
   ├─ Tarifs applicables
   └─ Procédure litiges
```

---

### Q: Puis-je avoir plusieurs utilisateurs pour un même revendeur?

**Actuellement:** Non, un revendeur = un compte.

**Améliorations futures:**
- Portail revendeur: accès personnel
- Dashboard: solde et ventes
- Notifications: alertes paiement
- Intégration: API pour synchronisation

---

## Résumé du workflow

```
╔═══════════════════════════════════════════════════════════╗
║          CYCLE COMPLET DE CONSIGNATION                    ║
╚═══════════════════════════════════════════════════════════╝

1️⃣ CRÉATION
   Revendeurs → Nouveau revendeur
   └─ Définir limite crédit

2️⃣ CONSIGNATION
   Consignations → Nouvelle consignation
   └─ Envoyer produits, solde augmente

3️⃣ SUIVI VENTES
   Journal Revendeur
   └─ Vérifier avancement ventes

4️⃣ ENREGISTREMENT VENTES
   Paiements Revendeurs → Enregistrer ventes
   └─ Solde diminue avec ventes

5️⃣ PAIEMENTS
   Paiements Revendeurs → Enregistrer paiements
   └─ Solde diminue

6️⃣ RÉCONCILIATION
   Journal Revendeur → Imprimer
   └─ Envoyer pour accord

7️⃣ GESTION INVENDUS
   Retour / Crédit / Nouvelle consignation
   └─ Fermer le cycle

╔═══════════════════════════════════════════════════════════╗
║         RAPPORTS & SUIVI EN CONTINU                       ║
║ Dashboard → Revendeurs section                            ║
║ - Soldes actuels tous revendeurs                          ║
║ - Alertes: limites proches, impayés                       ║
║ - Top revendeurs par performance                          ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Meilleure pratiques

### Pour maximiser les ventes revendeur

```
✓ Consigner à revendeurs bien localisés
✓ Produits adaptés à sa clientèle
✓ Limite crédit juste (pas trop bas = frein)
✓ Accompagner: matériel promo, support
✓ Paiements rapides (fidélise)
✓ Marges revendeur attrayantes
✓ Réapprovisionnement régulier
```

### Pour sécuriser les consignations

```
✓ Contrat de consignation signé
✓ Limite crédit appropriée
✓ Journal mensuel systématique
✓ Relance impayés: -2 sem, -1 sem, immédiate
✓ Droit de reprise des invendus
✓ Assurance risque marchandise
✓ Révision limite crédit trimestrielle
✓ Audit annuel des stocks
```

### Pour optimiser l'administratif

```
✓ Paramétrer limites crédit correctement
✓ Utiliser Journal pour réconciliation
✓ Imprimer journaux régulièrement
✓ Archiver les PDF
✓ Synchroniser avec comptabilité
✓ Alertes automatiques (futur)
✓ Export données pour analyse
```

---

## Conclusion

Le **système de revendeurs** de Stock Pro permet de:

✓ **Distribuer** sans risque crédit (consignation)
✓ **Suivre** en temps réel soldes et ventes
✓ **Réconcilier** facilement chaque mois
✓ **Auditer** complètement chaque transaction
✓ **Éviter** fraudes et malentendus

Utilisé correctement, il vous permet de **développer rapidement votre réseau** de distribution tout en **minimisant les risques financiers**.

Bon succès dans votre développement commercial!
