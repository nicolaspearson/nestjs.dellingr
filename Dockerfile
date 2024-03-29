# ------------------------------------------------------
#                       Dockerfile
# ------------------------------------------------------
# authors:  Nicolas Pearson
# image:    dellingr
# tag:      <GITHUB_SHA>
# how-to:   docker build -t dellingr:<GITHUB_SHA> --build-arg VERSION=<GITHUB_SHA> .
# requires: node:18.4-alpine3.16
# ------------------------------------------------------

# BUILDER - Artifacts build for production
FROM node:18.4-alpine3.16 AS builder

WORKDIR /usr/src/app
RUN chown node:node .
USER node

COPY --chown=node:node . .

RUN yarn install --immutable
RUN yarn build

# RUNNER - Production image
FROM node:18.4-alpine3.16

# Set the NODE_ENV to production
ENV NODE_ENV=production

WORKDIR /usr/src/app
USER node

COPY --chown=node:node --from=builder /usr/src/app/.pnp.cjs ./.pnp.cjs
COPY --chown=node:node --from=builder /usr/src/app/.pnp.loader.mjs ./.pnp.loader.mjs
COPY --chown=node:node --from=builder /usr/src/app/.yarn/cache ./.yarn/cache
COPY --chown=node:node --from=builder /usr/src/app/.yarn/plugins ./.yarn/plugins
COPY --chown=node:node --from=builder /usr/src/app/.yarn/releases ./.yarn/releases
COPY --chown=node:node --from=builder /usr/src/app/.yarnrc.yml ./.yarnrc.yml
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=builder /usr/src/app/yarn.lock ./yarn.lock

RUN yarn install --immutable
CMD yarn start
