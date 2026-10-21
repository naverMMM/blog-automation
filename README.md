# blog-automation

네이버 블로그(blog.naver.com/hoyoungeoi) 새 글을 바탕으로 CapCut 20초 영상을 만드는 자동화 작업 저장소.

## 폴더 구성

| 경로 | 내용 |
|---|---|
| `ccr/free-router.js` | Claude Code Router(CCR) 라우팅 규칙: 가벼운 질문은 무료 모델, 어려운 작업은 Claude |

## CCR 설정 순서 (Windows)

1. [CCR 3.1.3 설치 파일](https://github.com/musistudio/claude-code-router/releases/tag/v3.1.3)을 설치하고 실행
2. [OpenRouter](https://openrouter.ai)에서 API 키 발급
3. CCR 앱 **Providers → Add Provider → OpenRouter**에 키를 넣고 무료 모델(`:free`) 추가
4. `ccr/free-router.js` 맨 위 두 줄(`FREE_MODEL`, `CLAUDE_MODEL`)을 CCR **Models** 페이지의 이름과 똑같이 수정
5. **Routing → Add → Rule type: Node.js script**에서 `free-router.js` 선택 → Test script → 저장
6. **Agent Config → Add profile → Claude Code**로 프로필을 만들고 `ccr "프로필이름"`으로 실행

## free-router.js 판단 기준

- 무료 모델: 300자 미만의 짧은 질문, Claude Code의 백그라운드(Haiku 등급) 요청
- Claude 유지: "구현·디버그·플러그인·자동화" 등이 들어간 질문, 이미지 포함, 긴 대화(약 3만 토큰 초과)
- 무료 모델이 실패하면 `CLAUDE_MODEL`로 자동 전환
