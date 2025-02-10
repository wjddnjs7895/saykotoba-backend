module.exports = {
  apps: [
    {
      name: 'saykotoba-backend',
      script: 'dist/main.js', // 실행할 파일
      instances: 'max', // CPU 코어 수만큼 실행
      exec_mode: 'cluster', // 클러스터 모드 사용 (멀티 프로세스)
      watch: false, // 코드 변경 시 자동 재시작 (Docker 환경에서는 false 추천)
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
