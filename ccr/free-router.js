// CCR(Claude Code Router) Node.js 스크립트 라우팅 규칙
// 질문 내용을 보고: 가벼운 요청 → 무료 모델 / 무거운 요청 → Claude(기본 모델 유지)
//
// ▼ 아래 두 줄만 CCR "Models" 페이지에 보이는 이름 그대로 고치면 됩니다.
const FREE_MODEL   = "OpenRouter/qwen/qwen3-coder:free";        // 무료 모델
const CLAUDE_MODEL = "Anthropic/claude-sonnet-5-5";             // 무료 모델 실패 시 대신 쓸 모델

// 이 단어가 들어간 질문은 무조건 Claude로 (어려운 작업)
const HEAVY_WORDS = [
  "구현", "개발", "만들어", "리팩터", "리팩토링", "디버그", "디버깅", "버그", "에러", "오류",
  "설계", "아키텍처", "플러그인", "자동화", "스크립트", "테스트", "배포", "분석",
  "implement", "refactor", "debug", "error", "architecture", "plugin", "build", "fix",
];

const text = (input.summary.lastUserText || "").toLowerCase();
const model = (input.model || "").toLowerCase();

// 1) 이미지가 있거나 대화가 너무 길면 → Claude
if (input.summary.hasImage) return null;
if (input.tokenCount > 30000) return null;

// 2) Claude Code의 백그라운드/잡일 요청(Haiku 등급) → 무료 모델
const isBackground = model.includes("haiku");

// 3) 짧고, 어려운 단어가 없는 질문 → 무료 모델
const isShort = text.length > 0 && text.length < 300;
const isHeavy = HEAVY_WORDS.some((w) => text.includes(w));
const isLight = isShort && !isHeavy;

if (!isBackground && !isLight) return null; // 나머지는 원래 모델(Claude) 그대로

return {
  model: FREE_MODEL,
  // 무료 모델이 실패하거나 한도에 걸리면 Claude로 자동 전환
  fallback: { mode: "model-chain", models: [CLAUDE_MODEL], retryCount: 0 },
};
