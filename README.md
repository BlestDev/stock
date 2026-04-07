# Stock Pro - Système de Gestion de Stock

Application web complète de gestion de stock avec toutes les fonctionnalités nécessaires pour gérer votre inventaire, vos clients, vos fournisseurs, vos ventes, vos achats et votre réseau de revendeurs.

## Fonctionnalités principales

### Gestion d'inventaire
- **Tableau de bord** - Vue d'ensemble avec statistiques, top ventes et KPIs
- **Gestion des produits** - Inventaire complet avec alertes de stock bas
- **Mouvements de stock** - Historique détaillé de tous les mouvements
- **Catégories & Unités** - Organisation flexible des produits

### Gestion commerciale
- **Gestion des clients** - Base de données clients avec informations de contact
- **Gestion des fournisseurs** - Suivi des fournisseurs avec coordonnées et numéro d'identification
- **Ventes** - Enregistrement complet des ventes avec clients, montants et statuts
- **Achats** - Gestion des achats fournisseurs avec suivi des paiements
- **Facturation** - Création et gestion des factures avec impression professionnelle
- **Dépenses** - Suivi des dépenses d'entreprise par catégorie

### Système de revendeurs
- **Gestion des revendeurs** - Gestion des clients revendeurs avec limite de crédit
- **Consignations** - Attribution de produits aux revendeurs sans paiement immédiat
- **Paiements revendeurs** - Enregistrement des ventes et paiements contre consignation
- **Journal revendeur** - Suivi détaillé par produit avec impression de journal

### Outils
- **Impression de factures** - Génération professionnelle de factures avec détails entreprise
- **Impression de journaux** - Rapports détaillés des transactions revendeur
- **Paramètres** - Configuration d'entreprise avec support multi-devises
- **Authentification** - Système sécurisé de connexion utilisateur

## Configuration

### 1. Base de données Supabase

L'application utilise Supabase comme base de données PostgreSQL. La base de données est déjà provisionnée et configurée avec toutes les tables nécessaires.

### 2. Variables d'environnement

Mettez à jour le fichier `.env` avec vos identifiants Supabase:

```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

### 3. Installation

```bash
npm install
```

### 4. Lancement en développement

```bash
npm run dev
```

### 5. Build pour la production

```bash
npm run build
```

## Structure de la base de données

### Tables principales
- **categories** - Catégories de produits
- **units** - Unités de mesure
- **products** - Produits avec gestion de stock et seuil d'alerte
- **settings** - Paramètres utilisateur (devise, détails entreprise)

### Gestion commerciale
- **clients** - Clients avec informations de contact
- **suppliers** - Fournisseurs avec détails et identifiant fiscal
- **sales** - Ventes avec date, client et montant total
- **sale_items** - Lignes détaillées de chaque vente (produit, quantité, prix)
- **purchases** - Achats avec date, fournisseur et montant total
- **purchase_items** - Lignes détaillées de chaque achat
- **expenses** - Dépenses d'entreprise par catégorie
- **invoices** - Factures avec numéro, date et statut de paiement
- **invoice_items** - Lignes détaillées de chaque facture

### Système de revendeurs
- **reseller_clients** - Clients revendeurs avec limite de crédit et solde
- **consignments** - Produits consignés aux revendeurs
- **reseller_sales** - Ventes effectuées par les revendeurs
- **consignment_balances** - Soldes de crédit par revendeur
- **reseller_journals** - Journal détaillé de tous les mouvements revendeur (consignations, ventes, paiements)

### Suivi des mouvements
- **stock_movements** - Historique complet de tous les mouvements de stock

## Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Authentification sécurisée via Supabase Auth
- Chaque utilisateur ne voit que ses propres données

## Guide de démarrage

### Configuration initiale
1. Créez un compte via l'interface de connexion
2. Allez dans **Paramètres** et configurez:
   - Nom de l'entreprise
   - Email et téléphone
   - Devise (EUR, USD, GBP, Ariary/MGA)
   - Logo (URL optionnelle)

### Mise en place des données de base
3. Créez vos **Catégories** (ex: Électronique, Alimentation)
4. Créez vos **Unités** (ex: Kg, Pièce, Litre)
5. Créez vos **Produits** avec:
   - Nom et description
   - Catégorie et unité
   - Prix d'achat et prix de vente
   - Quantité en stock et seuil d'alerte

### Configuration commerciale
6. Ajoutez vos **Clients** avec informations de contact
7. Ajoutez vos **Fournisseurs** avec numéro d'identification et détails
8. (Optionnel) Ajoutez vos **Revendeurs** avec limites de crédit

### Opérations courantes

**Pour une vente directe:**
1. Allez dans **Ventes**
2. Créez une nouvelle vente (sélectionnez client, produits, quantités, prix)
3. Le stock se met à jour automatiquement
4. Générez une **Facture** pour le client
5. Imprimez la facture via **Imprimer Facture**

**Pour une consignation revendeur:**
1. Allez dans **Revendeurs** et créez un revendeur
2. Allez dans **Consignations** et attribuez des produits
3. Le solde de crédit du revendeur augmente
4. Dans **Paiements Revendeurs**, enregistrez les ventes du revendeur
5. Le solde de crédit diminue au fur et à mesure
6. Consultez le **Journal Revendeur** pour un historique détaillé

**Pour un achat fournisseur:**
1. Allez dans **Achats**
2. Créez un achat (sélectionnez fournisseur, produits, quantités)
3. Le stock se met à jour
4. Enregistrez les paiements au fournisseur

**Suivi et rapports:**
- **Tableau de bord** - Vue générale avec statistiques clés
- **Mouvements de stock** - Historique complet de tous les mouvements
- **Journal Revendeur** - Réconciliation détaillée par revendeur et produit
- **Imprimer Facture** - Génération de factures professionnelles
- **Imprimer Journal** - Rapports pour analyse et archivage

## Technologies utilisées

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Authentification)
- **Sécurité:** Row Level Security (RLS) sur toutes les tables
- **Icons:** Lucide React

## Devises supportées

L'application supporte les devises suivantes:
- EUR (Euro)
- USD (Dollar américain)
- GBP (Livre sterling)
- MGA/Ar (Ariary malgache)
