# Step 1: 베이스 이미지 선택
FROM node:20

# Step 2: 작업 디렉토리 설정
WORKDIR /app

# Step 3: Yarn 전역 설치 경로 환경 변수 설정 및 PM2 전역 설치
ENV PATH /usr/local/share/.config/yarn/global/node_modules/.bin:$PATH
RUN yarn global add pm2

# Step 4: package.json 및 yarn.lock 파일 복사
COPY package.json yarn.lock* ./

# Step 5: 의존성 설치
RUN yarn install

# Step 6: 애플리케이션 코드 복사
COPY . .

# Step 7: 포트 노출
EXPOSE 8080

# Step 8: 애플리케이션 실행
CMD ["yarn", "pm2:start"]
