# Guide de référence rapide - Stock Pro

Cheat sheet pour les opérations courantes et raccourcis.

---

## Navigation principale

| Élément | Accès | But |
|---------|-------|-----|
| Tableau de bord | Dashboard | Vue d'ensemble statistiques |
| Produits | Products | Gestion inventaire |
| Clients | Clients | Base de données clients |
| Fournisseurs | Suppliers | Gestion fournisseurs |
| Ventes | Sales | Enregistrer ventes directes |
| Achats | Purchases | Enregistrer achats fournisseurs |
| Factures | Invoices | Gestion factures clients |
| Imprimer Facture | Invoice Print | Générer facture pour impression |
| Dépenses | Expenses | Suivi dépenses d'entreprise |
| Mouvements | Movements | Historique stock |
| Catégories | Categories | Gestion catégories/unités |
| Revendeurs | Resellers | Gestion clients revendeurs |
| Consignations | Consignments | Attribution produits revendeurs |
| Paiements Revendeurs | Reseller Payments | Ventes/paiements revendeurs |
| Journal Revendeur | Reseller Journal | Détail transactions revendeur |
| Paramètres | Settings | Configuration entreprise |

---

## Flux rapides

### Vendre un produit rapidement

```
1. Ventes → Nouvelle vente
2. Sélectionner client
3. Ajouter produits/quantités
4. Marquer comme Payé
5. Enregistrer
6. Stock mis à jour automatiquement
```

### Acheter auprès d'un fournisseur

```
1. Achats → Nouvel achat
2. Sélectionner fournisseur
3. Ajouter produits/quantités
4. Marquer comme Payé/À payer
5. Enregistrer
6. Stock augmente automatiquement
```

### Imprimer une facture

```
1. Imprimer Facture
2. Sélectionner facture
3. Afficher aperçu
4. Imprimer (Ctrl+P ou bouton)
```

### Gérer une consignation revendeur

```
1. Consignations → Nouvelle
2. Sélectionner revendeur
3. Ajouter produits/quantités
4. Enregistrer
   → Solde revendeur augmente
   → Produits réservés pour revendeur

5. Paiements Revendeurs → Enregistrer vente
   → Enregistrer ce que revendeur a vendu
   → Solde diminue

6. Paiements Revendeurs → Enregistrer paiement
   → Enregistrer ce que revendeur paie
   → Solde diminue
```

### Consulter l'historique d'un revendeur

```
1. Journal Revendeur
2. Sélectionner revendeur
3. Voir tous mouvements par produit
4. Imprimer si besoin
```

---

## Statuts courants

### Statut de vente/achat
- **pending** - En attente de paiement
- **paid** - Payé

### Statut de facture
- **draft** - Brouillon (non envoyée)
- **sent** - Envoyée au client
- **paid** - Payée
- **cancelled** - Annulée

### Statut de paiement revendeur
- **Payé** - Paiement reçu
- **À payer** - Paiement en attente

---

## Formules clés

| Formule | Exemple |
|---------|---------|
| Stock = Achat - Vente - Consignation | 100 - 20 - 30 = 50 unités |
| Revenu vente = Qté × Prix vente | 10 × 100€ = 1000€ |
| Coût achat = Qté × Prix achat | 10 × 60€ = 600€ |
| Profit/Pièce = Prix vente - Prix achat | 100€ - 60€ = 40€ profit |
| Marge brute = (Revenu - Coût) / Revenu | (1000 - 600) / 1000 = 40% |
| Solde revendeur = Σ Consignations - Σ (Ventes + Paiements) | Automatique |

---

## Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| Ctrl+P | Imprimer (depuis aperçu) |
| Esc | Fermer modal/formulaire |
| Tab | Passer au champ suivant |
| Enter | Valider formulaire (parfois) |

---

## Icônes et signification

| Icône | Signification |
|-------|----------------|
| 📊 | Tableau de bord/Statistiques |
| 📦 | Produits/Inventaire |
| 👥 | Clients/Contacts |
| 🛒 | Ventes/Panier |
| 📥 | Achats/Entrées |
| 📄 | Factures/Documents |
| 💰 | Paiements/Argent |
| 📖 | Journal/Historique |
| 🖨️ | Imprimer |
| ⚙️ | Paramètres/Configuration |
| ✏️ | Éditer/Modifier |
| 🗑️ | Supprimer |
| ➕ | Ajouter/Créer |
| ❌ | Annuler/Fermer |
| ✓ | Confirmer/Valider |

---

## Montants et devises

### Devises supportées

| Code | Nom | Symbole |
|------|-----|---------|
| EUR | Euro | € |
| USD | Dollar US | $ |
| GBP | Livre sterling | £ |
| MGA | Ariary malgache | Ar |

Configurée dans Paramètres. Affichée sur toutes les factures.

### Notes sur les montants

- Tous les montants sont HT (hors taxes)
- Précision à 2 décimales
- Support des quantités décimales (5.5 kg, etc.)

---

## Calculs utiles

### Alerte stock

```
Si Stock < Seuil d'alerte → Alerte sur Tableau de bord
```

Exemple: Produit à 50 unités, seuil 20 → Pas d'alerte
Produit à 15 unités, seuil 20 → Alerte!

### Limite crédit revendeur

```
Si Solde > Limite crédit → ⚠️ Impossible nouvelle consignation
```

Exemple: Limite 5000€, solde 4500€ → Peut consigner 500€ max

### Top ventes

Tableau de bord affiche les 5 produits les plus vendus du mois.

---

## Actions impossibles

Ces actions ne sont pas permises pour sécurité/logique:

- ❌ Vendre plus qu'en stock (stock irait négatif)
- ❌ Payer plus que le solde du revendeur
- ❌ Consigner plus que la limite de crédit
- ❌ Créer client/produit sans nom
- ❌ Supprimer catégorie utilisée par produit
- ❌ Changer devise avec données existantes (perdrait sens)

---

## Bonnes pratiques

### Organisation
✓ Nommez produits de façon claire et cohérente
✓ Utilisez catégories logiques
✓ Notez les fournisseurs par raison sociale officielle
✓ Gardez adresses à jour

### Données
✓ Vérifiez les quantités avant validation
✓ Vérifiez les montants totaux
✓ Corrigez rapidement les erreurs
✓ Imprimez les journaux régulièrement

### Sécurité
✓ Gardez votre mot de passe secret
✓ Sauvegardez vos données régulièrement
✓ Vérifiez les montants sensibles
✓ Déconnectez-vous après utilisation

### Maintenance
✓ Vérifiez stock bas quotidiennement
✓ Nettoyez données inutiles mensuellement
✓ Archivez anciens journaux annuellement
✓ Testez les impressions régulièrement

---

## Dépannage express

| Problème | Solution |
|----------|----------|
| Impossible se connecter | Réinitialiser mot passe depuis écran login |
| Stock incorrect | Vérifier Mouvements pour erreurs |
| Chiffres pas à jour | Actualiser page (F5) |
| Impression vierge | Vérifier navigateur, accepter pop-ups |
| Facture manquante | Vérifier filtres date/client |
| Revendeur verrouillé | Vérifier solde vs limite crédit |
| Modal ne s'ouvre pas | Vérifier console (F12) pour erreurs |
| Application lente | Vérifier connexion internet |

---

## Scénarios fréquents

### Scénario 1: Gestion matière première

```
1. Créer produit "Farine 1kg"
2. Chaque achat fournisseur augmente stock
3. Chaque vente au client diminue stock
4. Seuil d'alerte = 100 (alerté à 50kg)
5. Mouvements trace tous achats/ventes
```

### Scénario 2: Distribution revendeur

```
1. Créer revendeur "Magasin X"
2. Consigner 100 unités produit A (valeur 5000€)
3. Solde revendeur = 5000€
4. Revendeur vend 50 unités → Solde = 2500€ restant
5. Revendeur paie 2500€ → Solde = 0€
6. Journal trace tout cela par produit
```

### Scénario 3: Import de facture

```
1. Créer facture avec produit A: 10 unités × 50€ = 500€
2. Imprimer facture pour envoi client
3. Sauvegarder PDF
4. Mettre à jour statut quand payé
```

---

## Formules Excel/Calc

Si vous exportez les données pour analyse:

```excel
=SOMME(C:C)                          # Total d'une colonne
=COUNTIF(A:A;"actif")               # Compter les actifs
=MOYENNE(C:C)                        # Moyenne
=SI(C1>D1;"Alerte";"OK")           # Alerte si dépassement
=RECHERCHEV(A1;Table;2;0)           # Chercher valeur
=(C1-D1)*E1                         # Calcul mixte (Solde × Prix)
```

---

## Contacts utiles

- **Documentation:** Voir README.md
- **Architecture:** Voir ARCHITECTURE.md
- **Guide complet:** Voir USER_GUIDE.md
- **Schéma DB:** Voir DATABASE_SCHEMA.md
- **Déploiement:** Voir DEPLOYMENT.md

---

## Mises à jour et nouvelles fonctionnalités

Fonctionnalités envisagées:
- [ ] Export CSV/Excel
- [ ] Notifications email
- [ ] Support mobile complet
- [ ] API pour intégrations tierces
- [ ] Support multi-devises simultanées
- [ ] Rapports avancés avec graphiques
- [ ] EDI avec fournisseurs
- [ ] Application mobile

---

Version: 1.0
Dernière mise à jour: 2024
Stock Pro - Système de gestion de stock complet
