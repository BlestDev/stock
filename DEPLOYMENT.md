# Guide de déploiement - Stock Pro

## Aperçu

Ce guide explique comment déployer Stock Pro en production. L'application est construite avec Vite et utilise Supabase comme backend.

---

## Prérequis

- Node.js 16+ et npm
- Un compte Supabase (gratuit ou payant)
- Un domaine (optionnel, mais recommandé)
- Un service d'hébergement (Vercel, Netlify, AWS S3+CloudFront, etc.)

---

## Étape 1: Préparation de Supabase

### 1.1 Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous ou créez un compte
3. Cliquez sur "New Project"
4. Remplissez:
   - **Name** - Nom du projet (ex: stock-pro-prod)
   - **Database Password** - Mot de passe sécurisé (gardez-le précieusement)
   - **Region** - Région proche de vous (EU, US, etc.)
5. Cliquez sur "Create new project"

Attendez 2-3 minutes que le projet soit créé.

### 1.2 Récupérer les clés Supabase

1. Une fois le projet créé, allez dans **Settings** > **API**
2. Vous verrez:
   - **Project URL** - L'URL de votre instance
   - **anon public** - Clé publique (peut être publiée)
   - **service_role** - Clé secrète (À GARDER PRIVÉE)

3. Copiez **Project URL** et **anon public key**

### 1.3 Appliquer les migrations

L'application inclut les migrations SQL. Vous avez deux options:

**Option A: Via l'interface Supabase (Recommandé)**
1. Dans Supabase, allez dans **SQL Editor**
2. Créez une nouvelle query
3. Copiez-collez le contenu du fichier `supabase/migrations/20260324160548_create_stock_management_schema.sql`
4. Exécutez
5. Répétez pour les autres fichiers de migration:
   - `20260326040827_add_reseller_management_system.sql`
   - `20260327130121_add_suppliers_and_reseller_journal.sql`

**Option B: Via Supabase CLI (Avancé)**
```bash
# Installer Supabase CLI
npm install -g supabase

# Lier votre projet
supabase link --project-id=YOUR_PROJECT_ID

# Appliquer les migrations
supabase db push
```

### 1.4 Vérifier les migrations

1. Dans Supabase, allez dans **SQL Editor**
2. Exécutez: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`
3. Vous devriez voir toutes les tables (products, clients, sales, etc.)

---

## Étape 2: Préparation du code

### 2.1 Cloner/Télécharger le code

Si vous utilisez Git:
```bash
git clone <repository-url>
cd <project-directory>
```

Sinon, téléchargez les fichiers source.

### 2.2 Installer les dépendances

```bash
npm install
```

### 2.3 Configurer les variables d'environnement

1. Créez un fichier `.env.production` (ou modifiez `.env`)
2. Ajoutez:
   ```
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
   ```

**Important:**
- Ne commitez JAMAIS ces fichiers `.env` sur GitHub
- Utilisez les secrets du service d'hébergement pour les variables sensibles
- La clé anon public est sûre de montrer (c'est une clé publique)
- Ne mettez JAMAIS la clé service_role en frontend

### 2.4 Tester localement

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) et testez:
1. S'inscrire
2. Créer des produits
3. Effectuer une vente
4. Consulter le tableau de bord

---

## Étape 3: Build de production

### 3.1 Créer le build

```bash
npm run build
```

Cela crée un dossier `dist/` avec les fichiers optimisés pour production.

### 3.2 Vérifier le build

```bash
npm run preview
```

Ouvrez [http://localhost:4173](http://localhost:4173) et testez que tout fonctionne.

---

## Étape 4: Déploiement

Choisissez votre plateforme d'hébergement:

### Option A: Vercel (Recommandé - Gratis et facile)

**Avantages:**
- Gratuit pour petits projets
- Déploiement automatique depuis Git
- Configuration simple
- Domaine gratuit inclus

**Procédure:**
1. Poussez votre code sur GitHub
2. Allez sur [https://vercel.com](https://vercel.com)
3. Cliquez sur "Import Project"
4. Sélectionnez votre repository GitHub
5. Vercel détectera Vite automatiquement
6. Dans **Environment Variables**, ajoutez:
   - `VITE_SUPABASE_URL=votre_url`
   - `VITE_SUPABASE_ANON_KEY=votre_clé`
7. Cliquez "Deploy"

Attendez 2-5 minutes. Une URL sera générée.

### Option B: Netlify

**Avantages:**
- Gratuit
- Déploiement par Git
- Configuration simple
- Formulaires inclus

**Procédure:**
1. Poussez votre code sur GitHub
2. Allez sur [https://netlify.com](https://netlify.com)
3. Cliquez "Connect new site"
4. Autorisez Netlify sur GitHub
5. Sélectionnez votre repository
6. Configurez:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Ajouter variables d'environnement dans **Site settings > Build & deploy > Environment**
8. Redéployez

### Option C: AWS S3 + CloudFront (Plus complexe)

Pour un contrôle maximum:

```bash
# 1. Build
npm run build

# 2. Créer un bucket S3
aws s3 mb s3://stock-pro-prod

# 3. Uploader les fichiers
aws s3 sync dist/ s3://stock-pro-prod

# 4. Configurer CloudFront pour HTTPS + caching
```

Voir documentation AWS pour détails complets.

### Option D: Hébergement traditionnel (cPanel, etc.)

1. Build localement: `npm run build`
2. Compressez le dossier `dist/`
3. Via FTP/cPanel, uploadez dans le répertoire public_html
4. Configurez les variables d'environnement via .env si possible
5. Testez

---

## Étape 5: Configuration du domaine

### 5.1 Avec Vercel/Netlify

1. Allez dans les paramètres de site
2. Cliquez "Add Domain"
3. Entrez votre domaine
4. Suivez les instructions pour configurer les DNS

### 5.2 Avec domaine personnalisé

Si vous utilisez un registrar (GoDaddy, Namecheap, etc.):

1. Récupérez les serveurs DNS de votre plateforme d'hébergement
2. Dans votre registrar, changez les nameservers
3. Attendez 24-48h pour propagation DNS

---

## Étape 6: Configuration HTTPS

Vercel et Netlify fournissent HTTPS automatiquement via Let's Encrypt.

Pour hébergement manuel:
- Let's Encrypt est gratuit
- Certbot permet renouvellement automatique
- Toujours utiliser HTTPS en production

---

## Étape 7: Sauvegardes et maintenance

### Sauvegardes Supabase

Supabase sauvegarde automatiquement, mais vous pouvez:

1. Dans Supabase, aller à **Backups**
2. Créer une sauvegarde manuelle
3. Télécharger en PDF ou CSV si nécessaire

### Monitoring

Configurez des alertes:

1. **Uptime:** Utilisez Pingdom ou Uptime Robot (gratuit)
2. **Erreurs:** Configurez Sentry (gratuit jusqu'à 5k erreurs/mois)
3. **Performances:** New Relic, DataDog (payant mais gratuit au démarrage)

---

## Points de sécurité à vérifier

Avant de déployer en production:

- [ ] Variables d'environnement configurées correctement
- [ ] HTTPS activé sur tous les domaines
- [ ] Pas de secrets dans le code source
- [ ] `.env` dans `.gitignore`
- [ ] Clé service_role JAMAIS en frontend
- [ ] RLS activé sur toutes les tables Supabase
- [ ] Rate limiting configuré si possible
- [ ] Authentification email requise (pas de comptes anonymes)
- [ ] Backups réguliers activés
- [ ] Monitoring et alertes configurés

---

## Améliorations post-déploiement

### Performance

1. **CDN pour assets statiques:** Images, CSS, JS via CloudFront/CloudFlare
2. **Compression:** Gzip/Brotli (souvent automatique)
3. **Caching:** Headers Cache-Control
4. **Minification:** Déjà fait par Vite

### Fonctionnalités

1. **Email transactionnel:** SendGrid, Mailgun pour notifications
2. **Logs:** CloudWatch, DataDog, LogRocket
3. **Analytics:** Plausible, Fathom ou Google Analytics
4. **Support client:** Intercom, Zendesk pour tickets

### Maintenance

1. **Updates:** Vérifier npm outdated régulièrement
2. **Security:** npm audit, Dependabot pour vulnérabilités
3. **Monitoring Supabase:** Vérifier quotidiennement les logs d'erreur
4. **Backups test:** Tester les restaurations mensuellement

---

## Dépannage courant

### L'app affiche une page blanche

**Causes possibles:**
- Clés Supabase incorrectes
- Base de données non accessible
- Erreurs JavaScript (vérifier console navigateur)

**Solutions:**
1. Vérifier `.env` ou variables d'environnement
2. Tester la connexion Supabase manuellement
3. Vérifier la console du navigateur (F12 > Console)

### Authentification ne fonctionne pas

**Causes possibles:**
- Clé anon incorrecte
- RLS trop restrictif
- Supabase auth non configuré

**Solutions:**
1. Vérifier clé anon dans Supabase Dashboard
2. Vérifier RLS policies: SELECT * FROM auth.users doit fonctionner
3. Tester avec curl: `curl -X POST https://votre_url/auth/v1/signup`

### Les migrations ne se sont pas appliquées

**Solutions:**
1. Allez dans Supabase SQL Editor
2. Exécutez: `SELECT * FROM information_schema.tables WHERE table_name='products';`
3. Si vide, copiez manuellement le contenu des migrations SQL
4. Exécutez chaque fichier migration un par un

### Performance lente

**Causes possibles:**
- Trop de requêtes simultanées
- Pas d'index sur les colonnes fréquemment interrogées
- Base de données pas optimisée

**Solutions:**
1. Ajouter des index: `CREATE INDEX idx_user_id ON products(user_id);`
2. Limiter les résultats avec pagination
3. Utiliser CloudFront pour les assets statiques
4. Vérifier les slow queries dans Supabase

---

## Coûts estimés

| Service | Coût | Notes |
|---------|------|-------|
| Supabase | Gratuit-$50+ | Gratuit jusqu'à 50k/mois |
| Vercel | Gratuit-$20+ | Gratuit pour petits projets |
| Domaine | $10-20/an | Namecheap, Porkbun |
| Email | Gratuit-$100+ | SendGrid, Mailgun |
| Monitoring | Gratuit-$50+ | Sentry, DataDog |
| **TOTAL** | **$10-40/mois** | Pour startup |

---

## Checklist de lancement

Avant le jour du lancement:

- [ ] Migrations appliquées et testées
- [ ] Variables d'environnement configurées
- [ ] Build en production testé localement
- [ ] Déploiement effectué sur la plateforme choisie
- [ ] Domaine configuré et DNS propagé
- [ ] HTTPS fonctionnant
- [ ] Authentification testée (signup + login)
- [ ] CRUD de base testé (produit, vente, etc.)
- [ ] Impression testée
- [ ] Backups configurées
- [ ] Monitoring activé
- [ ] Documentation d'accès sécurisée (mots de passe)
- [ ] Support/contact configuré
- [ ] Tests de performance (Lighthouse)

---

## Après le lancement

- [ ] Monitorez les erreurs quotidiennement
- [ ] Vérifiez les sauvegardes chaque semaine
- [ ] Testez la restaurabilité chaque mois
- [ ] Mettez à jour les dépendances mensuellement
- [ ] Vérifiez les vulnérabilités de sécurité (npm audit)
- [ ] Collectez les feedback utilisateurs
- [ ] Planifiez les améliorations

---

## Support et ressources

- **Documentation Supabase:** https://supabase.com/docs
- **Documentation Vite:** https://vitejs.dev
- **Documentation React:** https://react.dev
- **Communauté Supabase:** Discord officiel
- **Issues GitHub:** Signalez les bugs

---

## Prochaines étapes

Une fois en production:

1. **Ajouter authentification avancée:** 2FA, OAuth Google/GitHub
2. **Implémenter notifications:** Email pour paiements, alertes stock
3. **Ajouter rapports:** PDF générés, exports CSV
4. **Mobile app:** Expo/React Native pour iOS/Android
5. **API publique:** Pour intégrations tierces
6. **Multi-langue:** i18n pour français/anglais/autres
7. **SSO:** Pour entreprises (Okta, Azure AD)

Bon lancement!
