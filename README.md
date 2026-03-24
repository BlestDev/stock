# Stock Pro - Système de Gestion de Stock

Application web complète de gestion de stock avec toutes les fonctionnalités nécessaires pour gérer votre inventaire, vos clients, vos ventes et vos achats.

## Fonctionnalités

- **Tableau de bord** - Vue d'ensemble avec statistiques et KPIs
- **Gestion des produits** - Inventaire complet avec alertes de stock
- **Gestion des clients** - Base de données clients
- **Ventes** - Suivi des ventes et revenus
- **Achats** - Gestion des achats fournisseurs
- **Dépenses** - Suivi des dépenses d'entreprise
- **Mouvements de stock** - Historique complet des mouvements
- **Facturation** - Création et gestion des factures
- **Catégories & Unités** - Organisation des produits
- **Paramètres** - Configuration de l'application
- **Authentification** - Système sécurisé de connexion

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

- **categories** - Catégories de produits
- **units** - Unités de mesure
- **products** - Produits avec gestion de stock
- **clients** - Clients
- **suppliers** - Fournisseurs
- **sales** - Ventes
- **sale_items** - Lignes de vente
- **purchases** - Achats
- **purchase_items** - Lignes d'achat
- **expenses** - Dépenses
- **stock_movements** - Mouvements de stock
- **invoices** - Factures
- **invoice_items** - Lignes de facture
- **settings** - Paramètres utilisateur

## Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Authentification sécurisée via Supabase Auth
- Chaque utilisateur ne voit que ses propres données

## Premier usage

1. Créez un compte via l'interface de connexion
2. Configurez vos paramètres d'entreprise dans la section Paramètres
3. Ajoutez des catégories et unités de mesure
4. Créez vos produits
5. Ajoutez vos clients
6. Commencez à enregistrer vos ventes et achats

## Technologies utilisées

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Lucide React (Icons)
