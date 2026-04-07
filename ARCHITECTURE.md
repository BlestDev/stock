# Architecture technique - Stock Pro

## Vue d'ensemble

Stock Pro est une application web full-stack construite avec React et Supabase, conçue pour gérer les stocks, ventes, achats et un système de revendeurs complexe.

## Stack technologique

### Frontend
- **Framework:** React 18 avec TypeScript
- **Build tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **State management:** React Hooks (Context API pour l'authentification)

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (email/password)
- **Security:** Row Level Security (RLS) sur PostgreSQL

### Infrastructure
- **Deployment:** Vite build production
- **Environment variables:** .env avec clés Supabase

## Structure des dossiers

```
src/
├── components/
│   └── Layout.tsx          # Composant layout principal avec navigation
├── contexts/
│   └── AuthContext.tsx     # Contexte d'authentification
├── lib/
│   └── supabase.ts         # Client Supabase singleton
├── pages/
│   ├── Dashboard.tsx       # Tableau de bord avec statistiques
│   ├── Products.tsx        # Gestion des produits
│   ├── Clients.tsx         # Gestion des clients
│   ├── Suppliers.tsx       # Gestion des fournisseurs
│   ├── Sales.tsx           # Enregistrement des ventes
│   ├── Purchases.tsx       # Enregistrement des achats
│   ├── Expenses.tsx        # Suivi des dépenses
│   ├── Movements.tsx       # Historique des mouvements
│   ├── Invoices.tsx        # Gestion des factures
│   ├── InvoicePrint.tsx    # Impression de factures
│   ├── Resellers.tsx       # Gestion des revendeurs
│   ├── Consignments.tsx    # Gestion des consignations
│   ├── ResellerPayments.tsx # Paiements revendeurs
│   ├── ResellerJournal.tsx # Journal détaillé revendeur
│   ├── Categories.tsx      # Gestion catégories et unités
│   ├── Settings.tsx        # Configuration d'entreprise
│   └── Login.tsx           # Page de connexion/inscription
├── App.tsx                 # Composant principal avec routage
├── index.css               # Styles globaux
└── main.tsx                # Point d'entrée
```

## Architecture de la base de données

### Schéma relationnel

```
categories ──────┐
                 ├──> products <──┬── sales_items ──> sales
units ───────────┘                │
                 ┌────────────────┤
                 │                └── purchase_items ──> purchases
suppliers ───────┴────────────────────── purchases

reseller_clients ──┬─> consignments ──┐
                   │                   ├──> reseller_journals
                   └─> reseller_sales ─┘
                   └─> consignment_balances

clients ─────> sales
stock_movements <── products (modifications de quantité)
```

### Sécurité - Row Level Security (RLS)

Chaque table est protégée par RLS. Les politiques garantissent que:
- Les utilisateurs **ne voient que leurs propres données**
- Les données sont isolées par `user_id`
- Les opérations INSERT, UPDATE, DELETE sont restreintes
- Les politiques vérifient `auth.uid()` pour l'authentification

Exemple de politique:
```sql
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

## Patterns et conventions

### Gestion d'état et contexte

**AuthContext.tsx** - Fournit:
- `user` - Utilisateur actuellement connecté
- `signIn(email, password)` - Connexion
- `signUp(email, password)` - Inscription
- `signOut()` - Déconnexion
- `loading` - État de chargement

Utilisé dans App.tsx pour protéger les routes.

### Patterns de composants

#### Liste avec modal CRUD

Tous les composants de gestion (Products, Clients, Sales, etc.) suivent ce pattern:

```typescript
1. État local pour les données et modales
2. useEffect pour charger les données au montage
3. Fonction handleSubmit pour create/update
4. Fonction handleDelete pour supprimer
5. Form modal avec champs conditionnels
6. Tableau avec actions (edit, delete)
```

Exemple simplifié:
```typescript
const [items, setItems] = useState<Item[]>([]);
const [showModal, setShowModal] = useState(false);
const [editingItem, setEditingItem] = useState<Item | null>(null);
const [formData, setFormData] = useState({ /* champs */ });

useEffect(() => {
  loadItems();
}, [user]);

const loadItems = async () => {
  const { data } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', user.id);
  setItems(data || []);
};

const handleSubmit = async (e) => {
  if (editingItem) {
    await supabase.from('items').update(formData).eq('id', editingItem.id);
  } else {
    await supabase.from('items').insert([{ ...formData, user_id: user.id }]);
  }
  loadItems();
  setShowModal(false);
};
```

### Gestion du stock

Chaque opération (vente, achat, consignation) met à jour automatiquement le stock:

```typescript
// Vente: diminue le stock
newQuantity = product.quantity_in_stock - quantitySold

// Achat: augmente le stock
newQuantity = product.quantity_in_stock + quantityPurchased

// Consignation: stockée séparément dans consignments table
```

### Système de revendeurs

Le système de consignation fonctionne ainsi:

1. **Consignation créée:** Produits attribués au revendeur
   - Crée une entrée dans `consignments`
   - Augmente `reseller_clients.current_balance`

2. **Vente revendeur enregistrée:** Le revendeur vend les produits consignés
   - Crée une entrée dans `reseller_sales`
   - Diminue `current_balance` du montant vendu
   - Crée une entrée dans `reseller_journals` pour traçabilité

3. **Paiement revendeur:** Crédit utilisé
   - Enregistre un paiement
   - Diminue `current_balance`
   - Mise à jour `consignment_balances`

### Impression et rapports

**InvoicePrint.tsx:**
- Récupère les détails entreprise depuis `settings`
- Génère du HTML formaté avec les informations facture
- Utilise `window.open()` pour afficher l'aperçu
- Déclenche `window.print()` pour impression

**ResellerJournal.tsx:**
- Interroge `reseller_journals` avec filtrage par revendeur
- Groupe par produit pour suivi détaillé
- Génère HTML pour impression avec format professionnel

## Flux de données

### Flux d'authentification
```
Login.tsx → AuthContext.signIn() → Supabase Auth
                ↓
        Utilisateur connecté
                ↓
        App.tsx affiche AppContent
                ↓
        Layout affiche la navigation
```

### Flux de création de vente
```
Sales.tsx → Modal form → handleSubmit()
    ↓
Insert dans sales + sales_items
    ↓
Update products (quantité_in_stock)
    ↓
Créer stock_movement entry
    ↓
Recharger tableau
```

### Flux consignation revendeur
```
Consignments.tsx → Modal → handleSubmit()
    ↓
Insert dans consignments
    ↓
Update reseller_clients.current_balance += montant
    ↓
Créer reseller_journals entry
```

## Conventions de code

### Nommage
- Variables de composant: camelCase
- Types/Interfaces: PascalCase
- Chemins d'importation: relatifs avec './pages', './components'
- IDs Supabase: UUID générés côté serveur

### Styling
- Toutes les classes Tailwind (pas de CSS personnalisé)
- Breakpoints responsive: sm, md, lg (définis dans tailwind.config.js)
- Couleurs: palette Tailwind standard (blue, slate, green, red, amber)

### Gestion des erreurs
- Try/catch dans les opérations Supabase
- Alert() pour les erreurs utilisateur (à améliorer avec toast notifications)
- Affichage optionnel des erreurs dans l'UI

### Types
- Interfaces TypeScript pour tous les modèles de données
- Types des données récupérées définies localement dans chaque composant
- Pas de fichier global d'interfaces (chaque composant est auto-contenu)

## Points d'amélioration possibles

1. **Toast notifications** - Remplacer les alert() par un système de notifications
2. **Validation de formulaire** - Ajouter validation côté client avec Zod ou similaire
3. **Pagination** - Limiter les requêtes pour les gros volumes de données
4. **Cache** - Implémenter caching pour réduire les requêtes DB
5. **Tests** - Ajouter tests unitaires et e2e
6. **Logs** - Ajouter système de logging pour audit
7. **Permissions granulaires** - RLS pourrait être plus granulaire
8. **Mobile-responsive** - Améliorer responsive design pour petit écrans
9. **Offline mode** - Support mode hors ligne avec sync
10. **Export data** - Export CSV/PDF pour rapports

## Performance

### Optimisations actuelles
- Chargement différé des pages (lazy loading avec React.lazy possible)
- RLS filtre côté DB (pas de filtrage JS)
- Select spécifiques de colonnes nécessaires
- Réutilisation du client Supabase singleton

### Optimisations possibles
- Virtual scrolling pour longs tableaux
- Pagination pour listes volumineuses
- Memoization avec React.memo pour composants
- Code splitting avec React.lazy et Suspense
