# Schéma de la base de données - Stock Pro

## Vue d'ensemble

La base de données Stock Pro utilise PostgreSQL via Supabase. Toutes les tables ont Row Level Security (RLS) activé pour isoler les données par utilisateur.

---

## Tables principales

### 1. settings
Stocke la configuration de l'entreprise par utilisateur.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| company_name | text | | Nom de l'entreprise |
| email | text | | Email de contact |
| phone | text | | Téléphone |
| currency | text | DEFAULT 'EUR' | Devise (EUR, USD, GBP, MGA) |
| logo_url | text | | URL du logo |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

**RLS:** SELECT/UPDATE uniquement pour l'utilisateur propriétaire

---

### 2. categories
Catégories de produits.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| name | text | NOT NULL | Nom de la catégorie |
| created_at | timestamptz | DEFAULT now() | Date de création |

**RLS:** CRUD complet pour l'utilisateur propriétaire

**Exemple:** Électronique, Alimentaire, Vêtements, etc.

---

### 3. units
Unités de mesure.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| name | text | NOT NULL | Nom de l'unité |
| abbreviation | text | | Abréviation (ex: Kg, L) |
| created_at | timestamptz | DEFAULT now() | Date de création |

**RLS:** CRUD complet pour l'utilisateur propriétaire

**Exemple:** Kg, Pièce, Litre, Boîte, etc.

---

### 4. products
Stock de produits disponibles.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| name | text | NOT NULL | Nom du produit |
| description | text | | Description détaillée |
| category_id | uuid | FK(categories) | Catégorie du produit |
| unit_id | uuid | FK(units) | Unité de mesure |
| purchase_price | numeric(10,2) | NOT NULL | Prix d'achat unitaire |
| selling_price | numeric(10,2) | NOT NULL | Prix de vente unitaire |
| quantity_in_stock | numeric(10,2) | DEFAULT 0 | Quantité actuelle |
| alert_quantity | numeric(10,2) | DEFAULT 10 | Seuil d'alerte bas |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

**RLS:** CRUD complet pour l'utilisateur propriétaire

**Notes:**
- Tous les prix sont en devise configurée dans settings
- quantity_in_stock est mis à jour automatiquement par les ventes/achats
- alert_quantity génère une alerte sur le tableau de bord

---

### 5. clients
Clients réguliers.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| name | text | NOT NULL | Nom ou raison sociale |
| email | text | | Email de contact |
| phone | text | | Téléphone |
| address | text | | Adresse complète |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

**RLS:** CRUD complet pour l'utilisateur propriétaire

---

### 6. suppliers
Fournisseurs de produits.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| name | text | NOT NULL | Nom du fournisseur |
| contact | text | | Personne de contact ou email |
| phone | text | | Téléphone |
| tax_id | text | | SIRET, SIREN ou numéro d'identification |
| address | text | | Adresse |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

**RLS:** CRUD complet pour l'utilisateur propriétaire

---

## Tables de transactions commerciales

### 7. sales
Ventes directes aux clients.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| client_id | uuid | FK(clients) | Client acheteur |
| sale_date | date | NOT NULL | Date de la vente |
| total_amount | numeric(12,2) | DEFAULT 0 | Montant total HT |
| payment_status | text | DEFAULT 'pending' | Statut (pending, paid) |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

**RLS:** CRUD complet pour l'utilisateur propriétaire

**Note:** Les articles vendus sont dans la table sale_items

---

### 8. sale_items
Détail des ventes (lignes).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| sale_id | uuid | FK(sales) | Vente parente |
| product_id | uuid | FK(products) | Produit vendu |
| quantity | numeric(10,2) | NOT NULL | Quantité vendue |
| unit_price | numeric(10,2) | NOT NULL | Prix unitaire appliqué |
| subtotal | numeric(12,2) | NOT NULL | Montant ligne (quantité × prix) |
| created_at | timestamptz | DEFAULT now() | Date de création |

**Note:** À chaque vente enregistrée, le stock du produit est diminué

---

### 9. purchases
Achats auprès de fournisseurs.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| supplier_id | uuid | FK(suppliers) | Fournisseur |
| purchase_date | date | NOT NULL | Date de l'achat |
| total_amount | numeric(12,2) | DEFAULT 0 | Montant total HT |
| payment_status | text | DEFAULT 'pending' | Statut (pending, paid) |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

**RLS:** CRUD complet pour l'utilisateur propriétaire

**Note:** Les articles achetés sont dans la table purchase_items

---

### 10. purchase_items
Détail des achats (lignes).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| purchase_id | uuid | FK(purchases) | Achat parent |
| product_id | uuid | FK(products) | Produit acheté |
| quantity | numeric(10,2) | NOT NULL | Quantité achetée |
| unit_price | numeric(10,2) | NOT NULL | Prix unitaire appliqué |
| subtotal | numeric(12,2) | NOT NULL | Montant ligne (quantité × prix) |
| created_at | timestamptz | DEFAULT now() | Date de création |

**Note:** À chaque achat enregistré, le stock du produit est augmenté

---

### 11. invoices
Factures aux clients.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| invoice_number | text | NOT NULL | Numéro de facture unique |
| client_id | uuid | FK(clients) | Client facturé |
| invoice_date | date | NOT NULL | Date d'émission |
| due_date | date | | Date d'échéance |
| total_amount | numeric(12,2) | DEFAULT 0 | Montant total HT |
| payment_status | text | DEFAULT 'draft' | Statut (draft, sent, paid, cancelled) |
| notes | text | | Notes ou conditions particulières |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

**RLS:** CRUD complet pour l'utilisateur propriétaire

**Note:** Les lignes de facture sont dans la table invoice_items

---

### 12. invoice_items
Détail des factures (lignes).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| invoice_id | uuid | FK(invoices) | Facture parente |
| product_id | uuid | FK(products) | Produit facturé |
| quantity | numeric(10,2) | NOT NULL | Quantité facturée |
| unit_price | numeric(10,2) | NOT NULL | Prix unitaire appliqué |
| subtotal | numeric(12,2) | NOT NULL | Montant ligne |
| created_at | timestamptz | DEFAULT now() | Date de création |

---

### 13. expenses
Dépenses d'entreprise.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| description | text | NOT NULL | Description de la dépense |
| amount | numeric(10,2) | NOT NULL | Montant |
| category | text | | Catégorie (ex: Transport, Bureau) |
| expense_date | date | NOT NULL | Date de la dépense |
| created_at | timestamptz | DEFAULT now() | Date de création |

**RLS:** CRUD complet pour l'utilisateur propriétaire

---

### 14. stock_movements
Historique des mouvements de stock.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| product_id | uuid | FK(products) | Produit concerné |
| movement_type | text | NOT NULL | Type (Sale, Purchase, Consignment, etc.) |
| quantity_change | numeric(10,2) | NOT NULL | Quantité modifiée (+ ou -) |
| new_quantity | numeric(10,2) | NOT NULL | Solde après mouvement |
| reason | text | | Motif/description |
| movement_date | date | NOT NULL | Date du mouvement |
| created_at | timestamptz | DEFAULT now() | Date de création |

**RLS:** SELECT pour l'utilisateur propriétaire, INSERT automatique par triggers

**Note:** Remplie automatiquement lors des ventes, achats, consignations

---

## Tables du système de revendeurs

### 15. reseller_clients
Clients revendeurs.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| name | text | NOT NULL | Nom du revendeur/boutique |
| email | text | | Email de contact |
| phone | text | | Téléphone |
| address | text | | Adresse |
| credit_limit | numeric(12,2) | DEFAULT 0 | Limite de crédit autorisée |
| current_balance | numeric(12,2) | DEFAULT 0 | Solde actuel (montant dû) |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

**RLS:** CRUD complet pour l'utilisateur propriétaire

**Note:** current_balance = Somme des consignations - Somme des paiements/ventes

---

### 16. consignments
Produits donnés en consignation.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| reseller_client_id | uuid | FK(reseller_clients) | Revendeur |
| product_id | uuid | FK(products) | Produit consigné |
| quantity_consigned | numeric(10,2) | NOT NULL | Quantité remise |
| quantity_sold | numeric(10,2) | DEFAULT 0 | Quantité vendue |
| quantity_remaining | numeric(10,2) | NOT NULL | Quantité restante |
| unit_price | numeric(10,2) | NOT NULL | Prix unitaire appliqué |
| total_value | numeric(12,2) | NOT NULL | Valeur totale (quantité × prix) |
| consignment_date | date | NOT NULL | Date de remise |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Dernière modification |

**RLS:** CRUD complet pour l'utilisateur propriétaire

**Note:** quantity_remaining = quantity_consigned - quantity_sold

---

### 17. reseller_sales
Ventes effectuées par revendeurs.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| reseller_client_id | uuid | FK(reseller_clients) | Revendeur vendeur |
| product_id | uuid | FK(products) | Produit vendu |
| quantity_sold | numeric(10,2) | NOT NULL | Quantité vendue |
| unit_price | numeric(10,2) | NOT NULL | Prix appliqué |
| total_amount | numeric(12,2) | NOT NULL | Montant total |
| sale_date | date | NOT NULL | Date de la vente |
| created_at | timestamptz | DEFAULT now() | Date de création |

**RLS:** CRUD complet pour l'utilisateur propriétaire

**Note:** Diminue current_balance du revendeur et met à jour consignments

---

### 18. consignment_balances
Suivi des soldes de crédit.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| reseller_client_id | uuid | FK(reseller_clients) | Revendeur |
| amount_consigned | numeric(12,2) | DEFAULT 0 | Total consigné |
| amount_sold | numeric(12,2) | DEFAULT 0 | Total vendu |
| amount_paid | numeric(12,2) | DEFAULT 0 | Total payé |
| current_balance | numeric(12,2) | DEFAULT 0 | Solde actuel |
| last_updated | timestamptz | DEFAULT now() | Dernière mise à jour |

**RLS:** SELECT pour l'utilisateur propriétaire

**Note:** Historique des mouvements financiers du revendeur

---

### 19. reseller_journals
Journal détaillé des transactions revendeur.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Identifiant unique |
| user_id | uuid | FK(auth.users), NOT NULL | Utilisateur propriétaire |
| reseller_client_id | uuid | FK(reseller_clients) | Revendeur concerné |
| product_id | uuid | FK(products) | Produit concerné |
| transaction_type | text | NOT NULL | Type (Consignment, Sale, Payment) |
| quantity_change | numeric(10,2) | | Quantité modifiée |
| amount_change | numeric(12,2) | NOT NULL | Montant modifié |
| description | text | | Description détaillée |
| transaction_date | date | NOT NULL | Date de la transaction |
| balance_after | numeric(12,2) | | Solde après transaction |
| created_at | timestamptz | DEFAULT now() | Date de création |

**RLS:** SELECT pour l'utilisateur propriétaire, INSERT automatique

**Utilité:** Réconciliation détaillée par produit et revendeur

---

## Relations et schéma

```
auth.users (Supabase)
    ├──> settings (1:1)
    ├──> categories (1:n)
    ├──> units (1:n)
    ├──> products (1:n)
    │   ├──> sale_items (1:n) ──> sales (n:1)
    │   ├──> purchase_items (1:n) ──> purchases (n:1)
    │   ├──> invoice_items (1:n) ──> invoices (n:1)
    │   └──> stock_movements (1:n)
    │
    ├──> clients (1:n)
    │   ├──> sales (1:n)
    │   └──> invoices (1:n)
    │
    ├──> suppliers (1:n)
    │   └──> purchases (1:n)
    │
    ├──> expenses (1:n)
    │
    └──> reseller_clients (1:n)
        ├──> consignments (1:n) ──> products (n:1)
        ├──> reseller_sales (1:n) ──> products (n:1)
        ├──> consignment_balances (1:n)
        └──> reseller_journals (1:n)
```

---

## Politiques de sécurité (RLS)

Toutes les tables suivent ce pattern:

```sql
-- Lecteur pour utilisateur authentifié
CREATE POLICY "Users can view own [table]"
  ON [table] FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insertion
CREATE POLICY "Users can create [table]"
  ON [table] FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Modification
CREATE POLICY "Users can update own [table]"
  ON [table] FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Suppression
CREATE POLICY "Users can delete own [table]"
  ON [table] FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## Notes importantes

1. **Isolement des données:** Chaque utilisateur voit UNIQUEMENT ses données grâce à RLS
2. **Mises à jour automatiques:** Le stock et les balances se mettent à jour via triggers SQL
3. **Audit trail:** stock_movements et reseller_journals pour traçabilité complète
4. **Montants:** Tous les montants sont en NUMERIC(12,2) pour précision décimale
5. **Quantités:** Toutes les quantités sont en NUMERIC(10,2) pour supporter les décimales (Kg, L, etc.)
6. **Devise:** Définie dans settings, appliquée à tous les montants
7. **Soft delete:** Suppression physique pour simplicité (pas de soft delete)
8. **Timestamps:** Toutes les tables ont created_at et plupart updated_at

---

## Améliorations futures possibles

- [ ] Factures avec numérotation auto-incrémentée sécurisée
- [ ] Triggers pour audit trail automatique
- [ ] Support des remises en pourcentage
- [ ] Support des taxes
- [ ] Historique des prix de produits
- [ ] Notes/commentaires privés sur transactions
- [ ] Attribution de produits à plusieurs catégories
- [ ] Documents attachés (bons de livraison, etc.)
- [ ] Aperçus/brouillons avant validation
- [ ] Historique des modifications d'enregistrements
