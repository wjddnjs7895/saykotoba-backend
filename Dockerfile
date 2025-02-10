# Step 1: 베이스 이미지 선택
FROM node:20

# Step 2: 작업 디렉토리 설정
WORKDIR /app

# Step 3: package.json과 package-lock.json 복사
COPY package*.json ./

# Step 4: 패키지 설치
RUN yarn install

# Step 5: 애플리케이션 코드 복사
COPY . .

# Step 6: 포트 설정
EXPOSE 3000

# Step 7: 애플리케이션 실행
CMD ["yarn", "pm2:start"]
