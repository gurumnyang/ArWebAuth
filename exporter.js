const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

// 대상 디렉토리와 출력 파일 경로 설정
const targetDirectory = './'; // 사용하려는 디렉토리 경로로 변경
const outputFile = 'output.txt';

// ignore 인스턴스 생성
const ig = ignore();

// 1. .gitignore 파일 존재 시 그 내용도 추가
const gitignorePath = path.join(targetDirectory, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  ig.add(gitignoreContent);
  console.log('.gitignore 파일의 규칙을 추가합니다.');
} else {
  console.log('.gitignore 파일이 없어 건너뜁니다.');
}

// 2. 사용자 정의 ignore 배열 추가
const customIgnorePatterns = [
  '.git/',                 // 디렉토리
  '.devcontainer/',        // 디렉토리
  '.github/',              // 디렉토리
  '*.md',                  // Markdown 파일
  'package-lock.json',     // package-lock.json 파일
  '*.png', '*.jpg', '*.jpeg', '*.gif', '*.bmp', '*.tiff', // 이미지 파일들
  '*.xml',                 // XML 파일
  '*.ico',                  // 아이콘 파일
];
ig.add(customIgnorePatterns);
console.log('Custom ignore 패턴을 추가합니다.');

// 현재 실행 중인 스크립트 파일 자체(자기 자신)는 별도로 체크
const selfFilePath = path.resolve(__filename);

// 재귀적으로 디렉토리 내 모든 파일 경로 수집 (ignore 규칙 적용)
function getFiles(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(baseDir, fullPath);

    // 실행 파일 자체 제외
    if (path.resolve(fullPath) === selfFilePath) {
      console.log(`자기 자신 파일(${relativePath}) 제외`);
      return;
    }
    // 출력 파일도 제외
    if (path.resolve(fullPath) === path.resolve(outputFile)) {
      console.log(`출력 파일(${relativePath}) 제외`);
      return;
    }
    // ignore 패턴 적용
    if (ig.ignores(relativePath)) {
      console.log(`제외: ${relativePath}`);
      return;
    }
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, baseDir));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

// 내보내기 대상 파일 리스트 획득
const files = getFiles(targetDirectory);
let outputContent = '';

// 각 파일의 경로와 내용을 지정 형식으로 누적
files.forEach(file => {
  const fileContent = fs.readFileSync(file, 'utf8');
  outputContent += `# ${file}\n\`\`\`\n${fileContent}\n\`\`\`\n\n`;
});

// 누적된 내용을 output.txt 파일로 저장
fs.writeFileSync(outputFile, outputContent);
console.log(`모든 파일의 내용이 ${outputFile}에 저장되었습니다.`);
