# Build stage. Image pinned by digest: reproducible build and verified integrity.
# To bump it: docker pull node:22, then note the new digest.
FROM node:22@sha256:8a34c4ab3ea2c5cd194f07e317b2a8f09461d3c8b05c4e34c8ccd56d56024c4d AS build

WORKDIR /app
RUN chown node:node /app
USER node

# The lockfile is the source of truth: npm ci fails if package.json and package-lock.json
# diverge, and reinstalls exactly the versions verified by their hash.
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

COPY --chown=node:node . .

RUN npm run docker:build

# Final stage: OFFICIAL nginx image, pinned by digest.
# Deliberate choice: an official image is preferred over a third-party one
# (nginxinc/nginx-unprivileged). Non-root hardening will come from
# Docker Hardened Images, once authentication is in place.
# To bump it: docker buildx imagetools inspect nginx:alpine --format "{{.Manifest.Digest}}"
FROM nginx:alpine@sha256:db35bfc6b2951e7f8a72db5db120288c127ffaeeb4a6d4b95a26fead017d5913

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
