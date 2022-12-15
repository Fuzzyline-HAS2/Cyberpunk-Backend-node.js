# 하이드앤시크 쌈지길점 - 백엔드 node.js

### 🛠︎Tools🛠︎

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=black"/>

##

## 목차

1. [gitbash를 이용해 최신 버전 pull하기](#gitbash를-이용해-최신-버전-pull하기)
2. [실행](#실행)
3. [업데이트](#업데이트)
4. [문제 상황](#문제-상황)

### 실행 방법

/c/has2cyberpunk_react/web/server 위치에서

## gitbash를 이용해 최신 버전 pull하기

<a href = "https://git-scm.com/downloads">gitbash</a>가 설치되어있지 않다면?

```
$ git fetch #하고 이상없으면
$ git pull origin main
```

## 실행

```
$ npm start
```

## 업데이트

1. 코드를 작성한다.
2. 작성한 코드를 깃허브에 업로드한다.

```
$ git diff #파일의 변경된 부분을 확인한 뒤
$ git add . #파일의 변경된 부분 전부 추가
$ git commit -m "커밋 내용"
$ git push origin main
```

## 문제 상황

### 1. pull이 안된다.

fetch를 한 뒤 github 저장소와 다르면

```
$ git restore
```

restore를 통해 로컬 변경상황을 제거한 뒤 pull을 해주면 된다.
(로컬에서 작성한 변경사항은 삭제된다. -> 항상 파일을 최신으로 업데이트 해놓고 추가사항 코딩한 뒤 push할것)

작성자 : 안혜수
