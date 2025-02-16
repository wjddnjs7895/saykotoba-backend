# ------------------------
# 빌드 스테이지 (builder)
# ------------------------
FROM node:20 AS builder
WORKDIR /app
  
COPY package.json yarn.lock ./
RUN yarn install
  
COPY . .
RUN yarn build  # dist 폴더 생성
  
# ------------------------
# 실행 스테이지 (production)
# ------------------------
FROM node:20
WORKDIR /app
  
# pm2 글로벌 설치
ENV PATH /usr/local/share/.config/yarn/global/node_modules/.bin:$PATH
RUN yarn global add pm2
  
# 최종적으로 필요한 파일만 복사
COPY package.json yarn.lock ./
RUN yarn install --production
  
# 빌드 결과물(dist)만 복사
COPY --from=builder /app/dist ./dist
  
EXPOSE 8080
  
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
  
CMD if [ "$NODE_ENV" = "production" ]; then \
      yarn pm2:prod:start; \
    else \
      yarn pm2:dev:start; \
     fi  