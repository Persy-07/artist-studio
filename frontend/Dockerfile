FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]