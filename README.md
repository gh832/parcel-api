# parcel-api

Starter de la séance 2 : une API de suivi de colis, construite brique par brique pendant l'après-midi. Le code est en anglais, les commentaires en français.

## Lancer

```bash
npm install
npm run dev        # relancé à chaque modification, lit .env s'il existe
npm run check      # tsc --noEmit : vérifie les types
curl http://localhost:3000/
```

Le port se change avec `PORT=4000 npm run dev`. Les variables d'environnement peuvent aussi être mises dans un fichier `.env`, lu au démarrage s'il existe.

## Les étapes

Chaque exercice de la séance ajoute une couche à cette API, dans `src/` :

1. Routes Express, colis en mémoire
2. Les colis sont lus et écrits dans MongoDB
3. Les entrées HTTP sont validées avec Zod, route d'expédition
4. `Dockerfile`, `compose.yaml`, configuration par l'environnement

À la fin de chaque exercice, le corrigé est fait en direct : tout le monde repart du même code.

## Tester

`curl -i` dans le terminal, ou Postman, Insomnia ou Bruno sur votre poste : le tunnel rend l'API visible sur `localhost:3000`. Sauvegardez vos requêtes, elles servent à vérifier chaque étape.

## MongoDB pendant les étapes 2 et 3

Avant Compose, MongoDB tourne dans un conteneur lancé à la main :

```bash
docker run -d --name mongo -p 27017:27017 mongo:8
docker exec -it mongo mongosh parcels      # pour regarder les documents
```

L'API se connecte à `mongodb://localhost:27017` par défaut, variable `MONGO_URL` pour changer.
