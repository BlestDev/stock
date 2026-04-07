# Guide d'utilisation - Stock Pro

## Table des matières
1. [Connexion et compte](#connexion-et-compte)
2. [Configuration initiale](#configuration-initiale)
3. [Gestion des produits](#gestion-des-produits)
4. [Gestion commerciale](#gestion-commerciale)
5. [Système de revendeurs](#système-de-revendeurs)
6. [Reporting et impression](#reporting-et-impression)
7. [Paramètres et maintenance](#paramètres-et-maintenance)
8. [FAQ et dépannage](#faq-et-dépannage)

---

## Connexion et compte

### Première connexion
1. Accédez à l'application
2. Cliquez sur **"Créer un compte"**
3. Entrez votre email et mot de passe
4. Cliquez sur **"S'inscrire"**
5. Une fois inscrit, connectez-vous avec vos identifiants

### Connexion ultérieure
1. Entrez email et mot de passe
2. Cliquez sur **"Connexion"**
3. Vous êtes redirigé vers le tableau de bord

### Sécurité
- Votre mot de passe est chiffré et sécurisé
- Vos données sont isolées par compte utilisateur
- Personne d'autre ne peut accéder à vos informations

---

## Configuration initiale

### Étape 1: Configurer les paramètres d'entreprise

1. Cliquez sur **"Paramètres"** dans le menu latéral
2. Remplissez les informations:
   - **Nom de l'entreprise** - Nom complet de votre entreprise
   - **Email** - Email de contact principal
   - **Téléphone** - Numéro principal
   - **Devise** - Choisissez EUR, USD, GBP ou Ariary (MGA)
   - **Logo URL** (optionnel) - Lien vers votre logo pour l'impression

3. Cliquez sur **"Enregistrer les paramètres"**

**Important:** La devise choisie sera utilisée pour tous les montants de l'application. Vous pouvez la changer à tout moment.

### Étape 2: Créer les catégories

1. Allez dans **"Catégories"**
2. Cliquez sur **"Nouvelle catégorie"**
3. Entrez le nom (ex: "Électronique", "Alimentaire")
4. Cliquez sur **"Ajouter"**

Répétez pour chaque catégorie nécessaire. Les catégories organisent vos produits.

### Étape 3: Créer les unités de mesure

1. Toujours dans **"Catégories"** (onglet "Unités")
2. Cliquez sur **"Nouvelle unité"**
3. Entrez l'unité (ex: "Kg", "Pièce", "Litre", "Boîte")
4. Cliquez sur **"Ajouter"**

Les unités doivent correspondre à vos produits:
- Kg pour denrées pondérables
- Pièce pour articles unitaires
- Litre pour liquides
- etc.

---

## Gestion des produits

### Ajouter un produit

1. Cliquez sur **"Produits"** dans le menu
2. Cliquez sur **"Nouveau produit"**
3. Remplissez:
   - **Nom** - Nom complet du produit
   - **Description** (optionnel) - Détails supplémentaires
   - **Catégorie** - Catégorie existante
   - **Unité** - Unité de mesure
   - **Prix d'achat** - Coût unitaire à l'achat
   - **Prix de vente** - Prix de vente au public/revendeur
   - **Quantité en stock** - Quantité actuellement disponible
   - **Seuil d'alerte** - Quantité minimale avant alerte

4. Cliquez sur **"Ajouter produit"**

### Modifier un produit

1. Dans la liste des produits, cliquez sur l'icône **édition** (crayon) d'un produit
2. Modifiez les champs
3. Cliquez sur **"Mettre à jour"**

### Supprimer un produit

1. Dans la liste des produits, cliquez sur l'icône **poubelle** d'un produit
2. Confirmez la suppression

**Note:** Le stock est mis à jour automatiquement lors des ventes et achats.

### Alertes de stock

Le tableau de bord affiche des alertes si un produit est sous son seuil d'alerte. Vérifiez régulièrement:
- Les stocks bas
- Les produits à réapprovisionner

---

## Gestion commerciale

### Gestion des clients

#### Ajouter un client
1. Cliquez sur **"Clients"**
2. Cliquez sur **"Nouveau client"**
3. Remplissez:
   - **Nom** - Nom complet ou raison sociale
   - **Email** - Email de contact
   - **Téléphone** - Numéro de téléphone
   - **Adresse** - Adresse complète

4. Cliquez sur **"Ajouter client"**

#### Modifier/Supprimer un client
- Utilisez les icônes édition/poubelle comme pour les produits

### Gestion des fournisseurs

#### Ajouter un fournisseur
1. Cliquez sur **"Fournisseurs"**
2. Cliquez sur **"Nouveau fournisseur"**
3. Remplissez:
   - **Nom** - Raison sociale du fournisseur
   - **Contact** - Personne de contact ou email
   - **Téléphone** - Numéro de téléphone
   - **Numéro d'identification** - SIRET, SIREN, ID fiscal, etc.
   - **Adresse** (optionnel) - Adresse du fournisseur

4. Cliquez sur **"Ajouter fournisseur"**

### Enregistrer une vente

1. Cliquez sur **"Ventes"**
2. Cliquez sur **"Nouvelle vente"**
3. Remplissez:
   - **Client** - Sélectionnez le client
   - **Date** - Date de la vente (aujourd'hui par défaut)
   - **Produits** - Ajoutez les produits et quantités
   - **Montant total** - Calculé automatiquement
   - **Statut de paiement** - Payé ou À payer

4. Cliquez sur **"Enregistrer vente"**

**Résultat:**
- Le stock du produit diminue automatiquement
- Un mouvement de stock est créé
- La vente apparaît dans le tableau de bord

### Enregistrer un achat

1. Cliquez sur **"Achats"**
2. Cliquez sur **"Nouvel achat"**
3. Remplissez:
   - **Fournisseur** - Sélectionnez le fournisseur
   - **Date** - Date de l'achat
   - **Produits** - Ajoutez les produits et quantités
   - **Montant total** - Calculé automatiquement
   - **Statut de paiement** - Payé ou À payer

4. Cliquez sur **"Enregistrer achat"**

**Résultat:**
- Le stock du produit augmente automatiquement
- Un mouvement de stock est enregistré

### Créer une facture

1. Cliquez sur **"Factures"**
2. Cliquez sur **"Nouvelle facture"**
3. Remplissez:
   - **Client** - Client de la facture
   - **Date de facture** - Date d'émission
   - **Date d'échéance** - Date d'expiration
   - **Produits** - Sélectionnez produits et quantités
   - **Montant total** - Calculé automatiquement
   - **Statut** - Brouillon, Envoyée ou Payée
   - **Notes** (optionnel) - Conditions spéciales

4. Cliquez sur **"Enregistrer facture"**

### Imprimer une facture

1. Cliquez sur **"Imprimer Facture"**
2. Sélectionnez la facture à imprimer
3. Cliquez sur **"Afficher l'aperçu"**
4. La facture s'affiche avec:
   - Vos informations d'entreprise
   - Détails du client
   - Tous les produits et montants
   - Total à payer

5. Cliquez sur **"Imprimer"** ou utilisez Ctrl+P

---

## Système de revendeurs

Le système de revendeurs permet de donner des produits à des revendeurs qui les vendent ensuite en votre nom et vous payent.

### Concepts clés

- **Consignation** - Produits donnés sans paiement
- **Solde de crédit** - Montant que le revendeur doit
- **Vente revendeur** - Produits vendus par le revendeur
- **Paiement** - Règlement contre solde

### Ajouter un revendeur

1. Cliquez sur **"Revendeurs"**
2. Cliquez sur **"Nouveau revendeur"**
3. Remplissez:
   - **Nom** - Nom du revendeur/boutique
   - **Email** - Email de contact
   - **Téléphone** - Numéro de contact
   - **Adresse** - Adresse complète
   - **Limite de crédit** - Montant maximum pouvant être consigné

4. Cliquez sur **"Ajouter revendeur"**

### Consigner des produits

1. Cliquez sur **"Consignations"**
2. Cliquez sur **"Nouvelle consignation"**
3. Remplissez:
   - **Revendeur** - Choisissez le revendeur
   - **Date de consignation** - Date de remise
   - **Produits** - Ajoutez produits et quantités
   - **Montant total** - Calculé automatiquement

4. Cliquez sur **"Enregistrer consignation"**

**Résultat:**
- Les produits sont réservés pour ce revendeur
- Le solde de crédit du revendeur augmente
- Un journal d'entrée est créé

### Enregistrer les ventes revendeur

1. Cliquez sur **"Paiements Revendeurs"**
2. Cliquez sur **"Enregistrer une vente"**
3. Remplissez:
   - **Revendeur** - Revendeur concerné
   - **Date de vente** - Date de la vente
   - **Produits** - Ajoutez ce qui a été vendu
   - **Montant total** - Calculé automatiquement

4. Cliquez sur **"Enregistrer vente"**

**Résultat:**
- Le solde de crédit diminue du montant
- Journal mis à jour
- Consignation validée partiellement

### Enregistrer un paiement revendeur

1. Toujours dans **"Paiements Revendeurs"**
2. Cliquez sur **"Enregistrer un paiement"**
3. Remplissez:
   - **Revendeur** - Revendeur payant
   - **Date** - Date du paiement
   - **Montant payé** - Montant reçu
   - **Méthode** (optionnel) - Espèces, chèque, virement, etc.
   - **Notes** (optionnel) - Numéro de chèque, référence virement, etc.

4. Cliquez sur **"Enregistrer paiement"**

**Résultat:**
- Solde du revendeur réduit
- Paiement enregistré dans le journal

### Consulter le journal revendeur

1. Cliquez sur **"Journal Revendeur"**
2. Sélectionnez le revendeur
3. Visualisez:
   - **Tableau par produit** - Consignations et ventes de chaque produit
   - **Tableau détaillé** - Tous les mouvements en ordre chronologique
   - **Montants** - Consigné, Vendu, Solde

4. Pour imprimer, cliquez sur **"Imprimer le journal"**

---

## Reporting et impression

### Tableau de bord

Le tableau affiche:
- **Statistiques clés** - Total produits, clients, stocks bas
- **Top ventes** - Produits les plus vendus
- **Alertes** - Produits sous le seuil d'alerte
- **Revenus du mois** - Total des ventes

### Mouvements de stock

1. Cliquez sur **"Mouvements"**
2. Visualisez l'historique de tous les mouvements:
   - Date, type (Achat/Vente/Consignation)
   - Produit, quantité, motif
   - Nouveau solde

Utile pour tracer un produit ou vérifier les transactions.

### Impression de factures

1. Cliquez sur **"Imprimer Facture"**
2. Sélectionnez une facture
3. Visualisez l'aperçu avec:
   - Logo et détails entreprise
   - Client et adresse
   - Ligne-produits avec prix
   - Totaux et conditions

4. Imprimez ou téléchargez en PDF

### Impression de journal revendeur

1. Cliquez sur **"Journal Revendeur"**
2. Sélectionnez le revendeur
3. Cliquez sur **"Imprimer le journal"**
4. Document prêt pour archivage ou envoi au revendeur

---

## Paramètres et maintenance

### Modifier les paramètres d'entreprise

1. Cliquez sur **"Paramètres"**
2. Modifiez les informations
3. Cliquez sur **"Enregistrer les paramètres"**

Vous pouvez modifier:
- Nom et coordonnées
- Devise (attention: change toutes les valeurs)
- Logo pour impressions

### Changer de mot de passe

Actuellement, la modification de mot de passe se fait via votre compte Supabase. Vous pouvez réinitialiser votre mot de passe via l'écran de connexion.

### Sauvegardes de données

Vos données sont stockées sur Supabase avec sauvegardes automatiques. Aucune action nécessaire de votre part.

### Se déconnecter

1. Cliquez sur l'icône profil/menu utilisateur (en haut à droite)
2. Cliquez sur **"Déconnexion"**

---

## FAQ et dépannage

### Q: Comment puis-je ajouter plusieurs produits à une vente/achat?
**R:** Dans le formulaire, ajoutez d'abord un produit, puis cliquez sur "Ajouter un produit" pour ajouter d'autres lignes.

### Q: Les montants incluent-ils les taxes?
**R:** Non, les prix saisis sont HT (hors taxes). Vous pouvez ajouter des taxes manuellement dans les notes de facture si nécessaire.

### Q: Que se passe-t-il si j'enregistre une vente d'un produit non en stock?
**R:** Le stock passera en négatif, indiquant une dette. C'est signalé comme alerte. Réapprovisionnez rapidement.

### Q: Comment puis-je corriger une vente enregistrée par erreur?
**R:** Vous pouvez éditer la vente (cliquez sur l'icône édition), modifier les quantités, puis cliquer sur "Mettre à jour". Le stock s'ajustera automatiquement.

### Q: Comment fonctionne le système de revendeurs?
**R:**
1. Vous consignez des produits au revendeur (il les doit en valeur)
2. Le revendeur les vend
3. Vous enregistrez chaque vente (solde diminue)
4. Quand le revendeur vous paye, vous enregistrez le paiement
5. Le journal suit tout cela par produit

### Q: Le solde de crédit du revendeur peut-il être négatif?
**R:** Non, il ne peut pas descendre sous 0. Si vous essayez, le paiement sera limitée au solde existant.

### Q: Puis-je annuler une facture?
**R:** Vous pouvez modifier le statut d'une facture. Pour l'annuler, modifiez-la et changez le statut à "Annulée" (ou supprimez-la).

### Q: Comment puis-je exporter les données?
**R:** Actuellement, vous pouvez imprimer les journaux et factures. L'export CSV est envisagé pour des versions futures.

### Q: L'application fonctionne-t-elle hors ligne?
**R:** Non, vous avez besoin d'une connexion Internet pour utiliser l'application. C'est une limitation due à Supabase.

### Q: Mes données sont-elles sécurisées?
**R:** Oui, vos données sont:
- Stockées sur les serveurs sécurisés Supabase
- Chiffrées en transit (HTTPS)
- Isolées par compte utilisateur (RLS)
- Sauvegardées automatiquement

### Q: Comment contacte-t-on le support?
**R:** Les détails de support seront disponibles au démarrage de l'application ou sur le site principal.

---

## Conseils et bonnes pratiques

1. **Configurez d'abord tout:** Avant d'ajouter des données réelles, configurez les catégories, unités et paramètres.

2. **Testez avec des données fictives:** Essayez une vente, achat, consignation pour comprendre les flux.

3. **Sauvegardez régulièrement:** Même si c'est automatique, faites des captures d'écran des rapports importants.

4. **Nettoyez les données:** Supprimez les produits/clients/revendeurs inutilisés pour garder l'application propre.

5. **Vérifiez les seuils d'alerte:** Ajustez les seuils d'alerte de stock selon votre cas.

6. **Archivez les journaux:** Imprimez et archivez les journaux revendeur pour traçabilité légale.

7. **Revérifiez les montants:** Vérifiez toujours les montants totaux avant validation.

8. **Utilisez des descriptions:** Remplissez les descriptions des produits pour plus de clarté.

9. **Organisez les catégories:** Un bon système de catégories facilite la gestion.

10. **Communiquez avec revendeurs:** Partagez le journal avec les revendeurs pour transparence mutuelle.
