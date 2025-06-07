#!/bin/bash

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGION="us-west-2"
REGISTRY="762288592272.dkr.ecr.us-west-2.amazonaws.com"
REPOSITORY="lm-server"
IMAGE_NAME="lm-server"

echo -e "${YELLOW}🚀 Starting Docker build and push to ECR...${NC}"

# Step 1: Authenticate with ECR
echo -e "${YELLOW}📝 Authenticating with ECR...${NC}"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REGISTRY

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully authenticated with ECR${NC}"
else
    echo -e "${RED}❌ ECR authentication failed${NC}"
    exit 1
fi

# Step 2: Build Docker image with correct architecture
echo -e "${YELLOW}🔨 Building Docker image for linux/amd64...${NC}"
docker build --platform linux/amd64 -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

# Step 3: Tag the image
echo -e "${YELLOW}🏷️  Tagging image...${NC}"
docker tag $IMAGE_NAME:latest $REGISTRY/$REPOSITORY:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Image tagged successfully${NC}"
else
    echo -e "${RED}❌ Image tagging failed${NC}"
    exit 1
fi

# Step 4: Push to ECR
echo -e "${YELLOW}📤 Pushing image to ECR...${NC}"
docker push $REGISTRY/$REPOSITORY:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully pushed to ECR!${NC}"
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
    echo -e "${YELLOW}📍 Image URI: $REGISTRY/$REPOSITORY:latest${NC}"
else
    echo -e "${RED}❌ Push to ECR failed${NC}"
    exit 1
fi

echo -e "${GREEN}🏁 All done! Your Lambda function can now use this image.${NC}" 