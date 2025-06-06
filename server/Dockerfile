# Use the AWS Lambda Node.js 20 base image
FROM public.ecr.aws/lambda/nodejs:20 AS build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code and TypeScript config
COPY src/ ./src/
COPY tsconfig.json ./

# Build TypeScript files
RUN pnpm run build

# Remove dev dependencies
RUN pnpm prune --production

# Use a second stage to prepare the production image
FROM public.ecr.aws/lambda/nodejs:20

# Install pnpm in production image
RUN npm install -g pnpm

# Set the working directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy built files from the correct location (dist/src -> .)
COPY --from=build /app/dist/src/ ${LAMBDA_TASK_ROOT}/
COPY --from=build /app/node_modules ${LAMBDA_TASK_ROOT}/node_modules
COPY --from=build /app/package*.json ${LAMBDA_TASK_ROOT}/

# Set environment variables
ENV NODE_ENV=production

# Command to start the Lambda function (assuming server.js exports handler)
CMD ["server.handler"]
