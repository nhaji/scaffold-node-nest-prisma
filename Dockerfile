    # --- Build Stage ---
      FROM node:20-alpine AS builder

      ARG APP_WORKDIR
      ARG PRISMA_DUMMY_DATABASE_URL
      ARG PRISMA_SCHEMA
      ARG PRISMA_MIGRATIONS_PATH
  
      ENV APP_WORKDIR=${APP_WORKDIR:-/app}
      ENV PRISMA_DATABASE_URL=${PRISMA_DUMMY_DATABASE_URL:-postgresql://dummy:dummy@localhost:5432/dummy}
      ENV PRISMA_SCHEMA=${PRISMA_SCHEMA:-prisma/schema}
      ENV PRISMA_MIGRATIONS_PATH=${PRISMA_MIGRATIONS_PATH:-prisma/migrations}
  
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
  
      # Copy your entrypoint script
      COPY docker-entrypoint.sh ./
      RUN chmod +x docker-entrypoint.sh
  
      # Generate prisma client && Build
      RUN npx prisma generate \
      && npm run build 
      
      # --- Production Stage ---
      FROM node:20-alpine
      
      # Use build args with defaults for runtime
      ARG NODE_ENV
      ARG APP_USER
      ARG APP_WORKDIR
      ARG PORT
      ARG HEALTH_CHECK_ENDPOINT
      ARG LOG_DIR
      ARG PRISMA_CONFIG
      ARG PRISMA_SCHEMA
      ARG PRISMA_MIGRATIONS_PATH
  
      # Set environment variables for runtime
      ENV APP_WORKDIR=${APP_WORKDIR:-/app}
      ENV NODE_ENV=${NODE_ENV:-production}
      ENV APP_USER=${APP_USER:-app-bn001}
      ENV PORT=${PORT:-3001}
      ENV LOG_DIR=${LOG_DIR:-logs}
      ENV HEALTH_CHECK_ENDPOINT=${HEALTH_CHECK_ENDPOINT:-health}
      ENV PRISMA_CONFIG=${PRISMA_CONFIG:-prisma.config.ts}
      ENV PRISMA_SCHEMA=${PRISMA_SCHEMA:-prisma/schema}
      ENV PRISMA_MIGRATIONS_PATH=${PRISMA_MIGRATIONS_PATH:-prisma/migrations}
  
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
  
      # Copy entrypoint
      COPY --from=builder --chown=${APP_USER}:nodejs ${APP_WORKDIR}/docker-entrypoint.sh ./
  
      # Create log directory with correct permissions
      RUN mkdir -p ${LOG_DIR} && chown ${APP_USER}:nodejs ${LOG_DIR}
  
      # Switch user BEFORE copying application files
      USER ${APP_USER}
      
      EXPOSE ${PORT}
      
      HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
        CMD wget -q --spider http://localhost:${PORT}${HEALTH_CHECK_ENDPOINT} || exit 1
      
  
      # Run the command
      CMD ["./docker-entrypoint.sh"]
  