@echo off
REM === Path to Git Bash executable ===
set GITBASH="C:\Program Files\Git\bin\bash.exe"

REM === Project path in Git Bash style ===
set PROJECT_PATH=/e/ArthaniWealth/arthaniwealth

REM === Commands to run ===
set GIT_COMMANDS=cd %PROJECT_PATH%; \
git branch; \
git add .; \
git commit -m "Update: latest code changes"; \
git push origin master; \
npm run deploy -- -m "Redeploy with latest code"; \
echo "✅ Deployment Complete!"; \
read -p "Press Enter to exit..."

REM === Execute in Git Bash ===
%GITBASH% --login -i -c "%GIT_COMMANDS%"
