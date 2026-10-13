# Espace privé Experium (préparation)

La page publique reste hébergée par GitHub Pages. Le formulaire se trouve à `/prive/`.

## Important : ce qui est réellement protégé
- Les fichiers HTML, CSS, JS du dépôt GitHub Pages restent **publics**.
- Aucun secret, fichier confidentiel ou mot de passe ne doit se trouver dans ce dépôt.
- Seules les données enregistrées dans Supabase et soumises aux règles RLS de `setup.sql` sont protégées.
- Le code vérifie la session de l'utilisateur auprès de Supabase puis son autorisation via `private_members`.
- Connexion prévue par **adresse courriel + mot de passe**, pas par un pseudonyme.
- Tant que `config.js` contient les valeurs `REMPLACER`, le formulaire est désactivé.

## Activation (avant fusion de la branche)
1. Créer un projet sur https://supabase.com/.
2. Dans Authentication, conserver la connexion Email/Password, **désactiver les inscriptions libres** (invite only).
3. Dans Authentication > URL Configuration : définir la Site URL comme `https://experium.pub` et autoriser exactement `https://experium.pub/prive/` dans Redirect URLs. Vérifier que le domaine personnalisé pointe effectivement vers GitHub Pages.
4. Exécuter le contenu de `prive/setup.sql` dans le SQL Editor.
5. Dans Authentication > Users : créer au moins un utilisateur (ou l'inviter). Selon la méthode, les courriels de confirmation/réinitialisation doivent être opérationnels ; en production, configurer un SMTP fiable.
6. Dans le SQL Editor, ajouter cet utilisateur à `public.private_members` avec l'instruction commentée à la fin du SQL.
7. Remplacer uniquement `url` et `publishableKey` dans `prive/config.js` avec **Project URL** et **publishable key** (`sb_publishable_...`). Cette clé est publique par conception. **Ne jamais utiliser de clé secret ou service_role.**
8. Ajouter du contenu privé dans la table `public.private_pages` via le SQL Editor ; **ne jamais publier ce contenu dans GitHub**.
9. Tester : hors connexion ; mauvais mot de passe ; compte authentifié mais non membre ; membre autorisé ; déconnexion ; récupération du mot de passe. Tester aussi dans une fenêtre de navigation privée.
10. Fusionner la pull request uniquement après vérification. La fusion publiera le bouton et la page via GitHub Pages.

## Portée de la V1
C'est un portail de consultation privé minimal : pas encore d'édition des contenus, ni de gestion des utilisateurs depuis le site. L'administrateur utilise le tableau de bord Supabase. Le SQL n'accorde aucune permission d'écriture au navigateur.

Supabase Auth : https://supabase.com/docs/guides/auth/passwords
Sécurité RLS : https://supabase.com/docs/guides/database/postgres/row-level-security
Clés API : https://supabase.com/docs/guides/getting-started/api-keys
