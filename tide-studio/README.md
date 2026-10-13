# TIDE Studio — Prototype de storyboard (v0.1)

Ce dossier contient un outil HTML autonome pour commencer la **conception** du MVP TIDE.

## Fonctions déjà disponibles

- Carte de scènes reliées entre elles par les transitions et les choix
- Fiches de scène : acte, statut, contenu, objectif narratif, consignes pour l'opérateur, référence média
- Ajout, déplacement, duplication et suppression de scènes
- Création et modification des liens entre les scènes
- Sauvegarde automatique **dans le navigateur utilisé**
- Importation/exportation JSON pour faire une copie de sécurité

## Comment l'utiliser

Télécharger `index.html` et l'ouvrir dans Chrome, Edge ou Firefox. Cliquer une scène sur la carte pour afficher sa fiche. Utiliser **Exporter JSON** pour préserver une copie indépendante du navigateur.

Les huit fiches initiales sont **des exemples de navigation**, et non des décisions de scénario ou de mise en scène. Les trois actes et les trois décisions ne sont qu'une hypothèse de travail à valider.

## Important — privé et partage

- Le dépôt Github actuel d'Experium est **public**. Ne pas y committer d'histoires confidentielles, de secrets ou de données sur les participants.
- La page n'a **aucune authentification** et n'est **pas synchronisée** entre ordinateurs.
- Un fichier exporté JSON peut contenir des notes privées : le conserver dans un emplacement contrôlé.
- En l'état, Félix ne peut pas simplement se connecter pour retrouver le travail de Mathieu. Ce sera l'objet d'une étape séparée avec authentification et stockage privé.
- La lecture vidéo, le mode opérateur, le questionnaire QR et la collecte des données seront ajoutés seulement après validation de la structure narrative.

## Déploiement

Ne pas fusionner cette branche dans `main` avant de décider où et comment héberger cet outil privé. GitHub Pages diffuse publiquement les fichiers déployés.
