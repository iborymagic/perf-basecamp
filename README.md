# 🚀 프론트엔드 성능 베이스캠프

### 성능 오답노트 : memegle 프로젝트 성능 개선하기

## 😎 프로젝트 결과

[성능 개선 이전의 샘플 프로젝트 보러가기](http://frontend-performance-basecamp.s3-website.ap-northeast-2.amazonaws.com)

**성능 개선 결과 보러가기: [https://d3eylkxfsuwzri.cloudfront.net/](https://d3eylkxfsuwzri.cloudfront.net/)**

## 📕 미션 소개

프론트엔드 성능 베이스캠프에 오신 여러분 환영합니다! 🤗

이번 미션에서는 예제로 구성한 짤 검색 사이트, 'Memegle' 프로젝트의 성능을 개선해볼거에요.

<img width=400 src="https://user-images.githubusercontent.com/81607552/129674696-2fe7251b-90fe-4dec-8bc5-5d47bcc9159c.png"> <img width=370 src="https://user-images.githubusercontent.com/81607552/129674723-03d93732-1aba-42ca-a7cf-d2abe1005847.png">

Memegle 프로젝트는 곳곳에 성능을 저하시키는 요소들로 가득한데요.  
여기저기 구멍난 곳들을 고쳐서, 기본적인 수준으로 쓰는 데에 불편함이 없는 버전 1.0.0을 만들어주세요.

(엉망진창 성능의) 배포된 샘플 프로젝트는 [여기](http://frontend-performance-basecamp.s3-website.ap-northeast-2.amazonaws.com)에서 확인할 수 있습니다.

## 🌟 개선 결과

### 개선 전

<img width=600 src="https://user-images.githubusercontent.com/42052110/131472293-ce371878-497d-4b29-8b1c-f8888992fb02.png">

### 개선 후

<img width=600 src="https://user-images.githubusercontent.com/42052110/131472537-50b18ac0-bcb5-430b-9010-8f5cfae603e0.png">

## ✅ 개선 작업 목록

**1 요청 크기 줄이기**

- [x] 소스코드 크기 줄이기
  - Javascript 최적화는 production 모드에서 자동 적용(TerserWebpackPlugin)
  - optimization: production 모드에서 false를 true로 바꾸기
    (optimization을 true로 바꿔주면 Javascript 최적화 자동 적용 / production 모드에서 optimization의 기본값이 true)
    - 797KB ⇒ 248KB
  - devtool을 production mode일 때 false로 적용
    - 248KB ⇒ 233KB
  - MiniCssExtractPlugin과 CssMinimizerWebpackPlugin 적용
    - CssMinimizerWebpackPlugin은 CSS 파일의 공백을 없애고 압축해줍니다.
    - MiniCssExtractPlugin은 분리되는 자바스크립트 Chunk 파일 별로 CSS 파일을 분리해줍니다.
    - 233KB ⇒ 217KB
  - Cloudfront GZIP 설정
    - Cloudfront 기본 객체 압축 옵션을 사용했습니다.
    - 217KB ⇒ 68.7KB
- [x] 이미지 크기 줄이기
  - imagemin & imagemin-webp 사용
    - hero.jpg의 크기를 줄이기 위해 사용했습니다.
    - 703KB ⇒ 347KB
  - ImageMinimizerWebpackPlugin 사용
    - jpeg 파일의 손실 압축(mozjpeg)을 위해 사용했습니다.
    - 703KB ⇒ 134KB
  - WebpackImageResizeLoader 사용
    - hero.jpg, webp 이미지를 resize하기 위해 사용했습니다.
    - 10.7MB ⇒ 97.7KB
  - gif를 mp4로 대체
    - trending.gif ⇒ mp4
      - 1.3MB ⇒ 65.1KB
    - find.gif ⇒ mp4
      - 2.0MB ⇒ 58.8KB
  - 모바일 환경에서는 크기가 작은 이미지를 불러올 수 있도록 반응형으로 구현했습니다.
    - herosmall.webp
    - 25.9KB

**2 필요한 것만 요청하기**

- [x] 페이지별 리소스 분리
  - Code Chunking(node modules)
    - framework 관련 파일들(react, react-dom 등)을 우선 분리하고, 나머지는 페이지 별로 분리해줬습니다.
  - React.lazy는 라이브러리 분리가 불가능하다고 하여, loadable components를 이용하기로 했습니다.
    ![loadable components](https://user-images.githubusercontent.com/42052110/131474024-15f1655a-8440-4775-bccc-62b13866050d.png)
  - 68.7KB ⇒ 54.7KB

**3 같은 건 매번 새로 요청하지 않기**

- [x] CloudFront 캐시 설정
- [x] GIPHY의 trending API를 Search 페이지에 들어올 때마다 새로 요청하지 않아야 한다.
  - Context API를 이용해 Trending Gifs를 전역 상태로 저장했습니다.
  - 전역 상태에 Trending Gifs가 저장되어있으면 저장된 값을 갖다 쓰고, 그게 아니면 api 호출을 하도록 했습니다.
    ![code](https://user-images.githubusercontent.com/42052110/131569231-cbb56c76-3e16-4e46-a4ff-475581748150.png)

**4 최소한의 변경만 일으키기**

- [x] 검색 결과 > 추가 로드시 추가된 목록만 렌더되어야 한다.
  - GifItem 컴포넌트에 React.memo를 사용했습니다.
  - 9d3864de2b535ae371bcd897dffa94691a50c422
- [x] LayoutShift 없이 hover 애니메이션이 일어나야 한다.
  - GifItem에 top 속성 대신 transfrom 속성을 활용하여 애니메이션을 구현했습니다.
