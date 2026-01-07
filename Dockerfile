    # --- Build Stage ---
    FROM node:20-alpine AS builder

    ARG APP_WORKDIR=/app
    ARG PRISMA_DUMMY_DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy 
    ARG PRISMA_SCHEMA=prisma/schema.prisma
    ARG PRISMA_MIGRATIONS_PATH=prisma/migrations

    ENV DATABASE_URL=${PRISMA_DUMMY_DATABASE_URL} 
    ENV PRISMA_SCHEMA=${PRISMA_SCHEMA}
    ENV PRISMA_MIGRATIONS_PATH=${PRISMA_MIGRATIONS_PATH}

    WORKDIR ${APP_WORKDIR}
  
    # Set a higher npm timeout to prevent EIDLETIMEOUT
    RUN npm config set fetch-retry-maxtimeout 600000 --global # 10 minutes
    RUN npm config set fetch-retry-mintimeout 20000 --global   # 20 seconds
    RUN npm config set fetch-retries 5 --global      

    # Cache the packages declaration for fast clean install
    COPY package*.json ./
    # Install all dependencies if package*.json change
    RUN npm ci

    # Cache source code
    COPY . .

    # Generate prisma client && Build
    RUN npx prisma generate \
    && npm run build 
    
    # --- Production Stage ---
    FROM node:20-alpine
    
    # Use build args with defaults for runtime
    ARG NODE_ENV=production
    ARG APP_USER=app-bn001
    ARG APP_WORKDIR=/app
    ARG PORT=3001
    ARG HEALTH_CHECK_ENDPOINT=/health
    ARG LOG_DIR=logs
    ARG DATABASE_URL 
    ARG PRISMA_CONFIG
    ARG PRISMA_SCHEMA
    ARG PRISMA_MIGRATIONS_PATH

    # Set environment variables for runtime
    ENV NODE_ENV=${NODE_ENV}
    ENV APP_USER=${APP_USER}
    ENV PORT=${PORT}
    ENV LOG_DIR=${LOG_DIR}
    ENV APP_WORKDIR=${APP_WORKDIR}
    ENV HEALTH_CHECK_ENDPOINT=${HEALTH_CHECK_ENDPOINT}
    ENV PRISMA_CONFIG=${PRISMA_CONFIG}
    ENV PRISMA_SCHEMA=${PRISMA_SCHEMA}
    ENV PRISMA_MIGRATIONS_PATH=${PRISMA_MIGRATIONS_PATH}
    
    WORKDIR ${APP_WORKDIR}

    # Create non-root user FIRST
    RUN addgroup -g 1001 -S nodejs && \
    adduser -S ${APP_USER} -u 1001

    # Copy ONLY package files first
    COPY package*.json ./

    # Install PRODUCTION dependencies only
    RUN npm install --only=production

    # Copy the built application from the builder stage
    COPY --from=builder --chown=${APP_USER}:nodejs ${APP_WORKDIR}/dist ./dist

    # Copy prisma config
    COPY --from=builder --chown=${APP_USER}:nodejs ${APP_WORKDIR}/${PRISMA_CONFIG} ./${PRISMA_CONFIG}
    
    # Copy prisma schema
    COPY --from=builder --chown=${APP_USER}:nodejs ${APP_WORKDIR}/${PRISMA_SCHEMA} ./${PRISMA_SCHEMA}

    # Copy prisma migrations
    COPY --from=builder --chown=${APP_USER}:nodejs ${APP_WORKDIR}/${PRISMA_MIGRATIONS_PATH} ./${PRISMA_MIGRATIONS_PATH}

    # Create log directory with correct permissions
    RUN mkdir -p ${LOG_DIR} && chown ${APP_USER}:nodejs ${LOG_DIR}

    # Switch user BEFORE copying application files
    USER ${APP_USER}
    
    EXPOSE ${PORT}
    
    HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
      CMD wget -q --spider http://localhost:${PORT}${HEALTH_CHECK_ENDPOINT} || exit 1
    

    # Command to run the NestJS application
    CMD ["node", "dist/src/main.js"]
