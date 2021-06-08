# MemoDeck
Vous avez des trous de mémoire ? Des notions à retenir ? 

Avec MemoDeck, apprenez à votre rythme de façon interactive et gratuite grâce à un chatbot vocal. 

N’hésitez plus, vous retiendrez mieux ! 
# Objectif
MemoDeck permet de réviser des notions sous forme de carte mémoire (flashcard) avec une question et une réponse. Une carte mémoire est un dispositif d'apprentissage fondé sur la technique de la répétition espacée. De plus, un chatbot vocal sera disponible pour rendre plus interactif l’apprentissage.
# Procédure d'installation
Après clonnage de ce repo GIT. Il faut posséder une base de données mysql portant le nom epsi. Pour cela il y a la structure des tables dans le fichier `./src/db/create-db.sql`. Une manière plus simple consiste à lancer le `docker-compose.yml` qui crée une base de donnée mariadb.

Les ports sont définis dans le fichier `.env` pour les variables d'environnements (fait parti du .gitignore), pour le créer vous pouvez vous inspirer du fichier `.env-example`.

Il est nécessaire d'avoir une version node.js pour lancer l'application.
```
# lancer l'application
npm start

# lancer les tests jest et supertest (lancement préalable du serveur requis)
npm run test

# lancer le serveur (port 3000) et les tests
npm run ci
```
Les fichiers dans le dossier `src/routes` décrivent l'API et les routes du sites.
