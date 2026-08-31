# Etage de build. Image epinglee par digest : build reproductible et integrite verifiee.
# Pour la remonter : docker pull node:22, puis relever le nouveau digest.
FROM node:22@sha256:8a34c4ab3ea2c5cd194f07e317b2a8f09461d3c8b05c4e34c8ccd56d56024c4d AS build

WORKDIR /app
RUN chown node:node /app
USER node

# Le lockfile fait foi : npm ci echoue si package.json et package-lock.json divergent,
# et reinstalle exactement les versions verifiees par leur hachage.
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run docker:build

# Etage final : image nginx OFFICIELLE, epinglee par digest.
# Choix assume : on prefere une image officielle a une image tierce
# (nginxinc/nginx-unprivileged). Le durcissement non-root viendra des
# Docker Hardened Images, une fois l'authentification en place.
# Pour la remonter : docker buildx imagetools inspect nginx:alpine --format "{{.Manifest.Digest}}"
FROM nginx:alpine@sha256:db35bfc6b2951e7f8a72db5db120288c127ffaeeb4a6d4b95a26fead017d5913

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
