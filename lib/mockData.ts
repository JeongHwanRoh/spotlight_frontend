// Placeholder/demo data only. Real values will come from the FastAPI
// backend once the analytics endpoints are implemented (Phase 1 API work).

export const DISTRICTS: string[] = [
  "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
  "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
  "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
];

export const SERVICES = [
  { code: "CS100001", name: "한식음식점" },
  { code: "CS100002", name: "카페" },
  { code: "CS100003", name: "일반의류" },
] as const;

export const TIME_SLOTS = [
  { code: "t0006", label: "00-06시" },
  { code: "t0611", label: "06-11시" },
  { code: "t1114", label: "11-14시" },
  { code: "t1417", label: "14-17시" },
  { code: "t1721", label: "17-21시" },
  { code: "t2124", label: "21-24시" },
] as const;

export const AGE_GROUPS = [
  { code: "age10", label: "10대" },
  { code: "age20", label: "20대" },
  { code: "age30", label: "30대" },
  { code: "age40", label: "40대" },
  { code: "age50", label: "50대" },
  { code: "age60p", label: "60대 이상" },
] as const;

export const QUARTERS = ["2025 Q4", "2026 Q1"] as const;

export type RankingBasis = "quarter" | "weekday" | "time" | "age";

export const RANKING_BASIS_TABS: { key: RankingBasis; label: string; anchor: string }[] = [
  { key: "quarter", label: "분기별", anchor: "quarter" },
  { key: "weekday", label: "요일별", anchor: "weekday" },
  { key: "time", label: "시간대별", anchor: "time" },
  { key: "age", label: "연령대별", anchor: "age" },
];

export type RiskLevel = "risk" | "warn" | "good";

export interface ServiceInsight {
  name: string;
  level: RiskLevel;
  quarterSalesLabel: string;
  barHeightPct: number;
  open: number;
  close: number;
  stores: number;
  average: string;
  pills: { level: RiskLevel; text: string }[];
  message: string;
}

// Ranked TOP5 업종 for the currently selected district/quarter (demo values).
export const TOP5_INSIGHTS: ServiceInsight[] = [
  {
    name: "한식음식점",
    level: "risk",
    quarterSalesLabel: "962억",
    barHeightPct: 92,
    open: 4.1,
    close: 12.3,
    stores: 1240,
    average: "7,800만원",
    pills: [
      { level: "risk", text: "폐업률 > 개업률 × 3" },
      { level: "risk", text: "점포 수 과잉" },
    ],
    message: "폐업률이 개업률의 3배로 생존이 어려운 포화 상권입니다. 강력한 차별화 전략 없이는 신규 진입을 권장하지 않습니다.",
  },
  {
    name: "일반의원",
    level: "warn",
    quarterSalesLabel: "925억",
    barHeightPct: 86,
    open: 6.3,
    close: 6.7,
    stores: 312,
    average: "29,600만원",
    pills: [
      { level: "warn", text: "개폐업률 균형" },
      { level: "warn", text: "높은 진입 장벽" },
    ],
    message: "개폐업률이 비슷해 안정적이나, 전문 면허 업종으로 진입 장벽이 높습니다. 입지보다 전문 분야 선택이 더 중요합니다.",
  },
  {
    name: "일반의류",
    level: "warn",
    quarterSalesLabel: "654억",
    barHeightPct: 62,
    open: 5.2,
    close: 7.1,
    stores: 520,
    average: "12,600만원",
    pills: [
      { level: "warn", text: "시장 축소 추세" },
      { level: "warn", text: "온라인 경쟁" },
    ],
    message: "폐업률이 개업률을 소폭 앞서며 오프라인 의류 시장 축소 추세가 보입니다. 온라인 병행 전략이 필수입니다.",
  },
  {
    name: "일반교습학원",
    level: "good",
    quarterSalesLabel: "480억",
    barHeightPct: 48,
    open: 8.5,
    close: 4.8,
    stores: 430,
    average: "11,200만원",
    pills: [
      { level: "good", text: "개업률 > 폐업률" },
      { level: "good", text: "안정적 수요" },
    ],
    message: "개업률이 폐업률을 크게 웃돌며 성장 중입니다. 학령 인구가 많은 지역 특성상 수요가 안정적입니다.",
  },
  {
    name: "커피·음료",
    level: "good",
    quarterSalesLabel: "222억",
    barHeightPct: 31,
    open: 8.2,
    close: 3.1,
    stores: 287,
    average: "7,700만원",
    pills: [
      { level: "good", text: "개업률 ↑ 급성장" },
      { level: "good", text: "평균 매출 38%↑" },
    ],
    message: "개업률(8.2%)이 폐업률(3.1%)의 2.6배로 성장 추세입니다. 점포당 평균 매출도 서울 평균 대비 38% 높아 유망합니다.",
  },
];

export const TOTAL_SALES_LABEL = "6,670억";

export const WEEKDAY_SALES = [
  { key: "mon", label: "월", pct: 72 },
  { key: "tue", label: "화", pct: 82 },
  { key: "wed", label: "수", pct: 88 },
  { key: "thu", label: "목", pct: 92 },
  { key: "fri", label: "금", pct: 97 },
  { key: "sat", label: "토", pct: 58 },
  { key: "sun", label: "일", pct: 44 },
];

export const TIME_DISTRIBUTION: { code: string; label: string; pct: number; color: string }[] = [
  { code: "t0006", label: "00-06시", pct: 3, color: "#2354d9" },
  { code: "t0611", label: "06-11시", pct: 12, color: "#2f68ed" },
  { code: "t1114", label: "11-14시", pct: 18, color: "#3d82f2" },
  { code: "t1417", label: "14-17시", pct: 22, color: "#64a6ee" },
  { code: "t1721", label: "17-21시", pct: 31, color: "#9ac8f4" },
  { code: "t2124", label: "21-24시", pct: 14, color: "#c4defb" },
];

export const AGE_DISTRIBUTION: { code: string; label: string; pct: number; color: string }[] = [
  { code: "age10", label: "10대", pct: 4, color: "#2354d9" },
  { code: "age20", label: "20대", pct: 18, color: "#2867e6" },
  { code: "age30", label: "30대", pct: 21, color: "#347ef0" },
  { code: "age40", label: "40대", pct: 24, color: "#60a5fa" },
  { code: "age50", label: "50대", pct: 20, color: "#93c5fd" },
  { code: "age60p", label: "60대+", pct: 13, color: "#bfdbfe" },
];

export const DONG_MAP: Record<string, string[]> = {
  강남구: ["개포1동", "개포4동", "논현1동", "논현2동", "대치1동", "대치2동", "대치4동", "도곡1동", "도곡2동", "삼성1동", "삼성2동", "세곡동", "신사동", "압구정동", "역삼1동", "역삼2동", "일원1동", "일원본동", "자곡동", "청담동"],
  강동구: ["강일동", "고덕1동", "고덕2동", "길동", "둔촌1동", "둔촌2동", "명일1동", "명일2동", "상일동", "성내1동", "성내2동", "성내3동", "암사1동", "암사2동", "암사3동", "천호1동", "천호2동", "천호3동"],
  강북구: ["번1동", "번2동", "번3동", "수유1동", "수유2동", "수유3동", "우이동", "인수동", "미아동", "삼각산동"],
  강서구: ["가양1동", "가양2동", "가양3동", "공항동", "등촌1동", "등촌2동", "방화1동", "방화2동", "방화3동", "화곡1동", "화곡2동", "화곡3동", "화곡6동", "화곡본동", "마곡동"],
  관악구: ["봉천동", "남현동", "서림동", "청룡동", "인헌동", "신원동", "미성동", "행운동", "신림동", "난향동", "난곡동", "조원동", "중앙동"],
  광진구: ["자양1동", "자양2동", "자양3동", "자양4동", "구의1동", "구의2동", "구의3동", "광장동", "중곡1동", "중곡2동", "중곡3동", "중곡4동", "화양동", "능동"],
  구로구: ["가리봉동", "고척1동", "고척2동", "구로1동", "구로2동", "구로3동", "신도림동", "오류1동", "오류2동", "항동", "개봉1동", "개봉2동", "개봉3동"],
  금천구: ["가산동", "독산1동", "독산2동", "독산3동", "독산4동", "시흥1동", "시흥2동", "시흥3동", "시흥4동", "시흥5동"],
  노원구: ["공릉1동", "공릉2동", "노해동", "상계1동", "상계2동", "상계3동", "상계4동", "상계5동", "상계6동", "월계1동", "월계2동", "월계3동", "중계1동", "중계2동", "중계본동", "하계1동", "하계2동"],
  도봉구: ["도봉1동", "도봉2동", "방학1동", "방학2동", "방학3동", "쌍문1동", "쌍문2동", "쌍문3동", "쌍문4동", "창1동", "창2동", "창3동", "창4동", "창5동"],
  동대문구: ["답십리1동", "답십리2동", "용두동", "전농1동", "전농2동", "청량리동", "회기동", "이문1동", "이문2동", "장안1동", "장안2동", "제기동", "신설동"],
  동작구: ["노량진1동", "노량진2동", "대방동", "동작동", "본동", "사당1동", "사당2동", "사당3동", "사당4동", "사당5동", "상도1동", "상도2동", "상도3동", "상도4동", "신대방1동", "신대방2동", "흑석동"],
  마포구: ["공덕동", "대흥동", "도화동", "마포동", "망원1동", "망원2동", "상암동", "서교동", "성산1동", "성산2동", "신수동", "아현동", "용강동", "중동", "합정동", "연남동"],
  서대문구: ["남가좌1동", "남가좌2동", "북가좌1동", "북가좌2동", "신촌동", "연희동", "천연동", "충현동", "홍제1동", "홍제2동", "홍제3동", "홍은1동", "홍은2동", "홍은3동"],
  서초구: ["반포1동", "반포2동", "반포3동", "반포4동", "방배1동", "방배2동", "방배3동", "방배본동", "서초1동", "서초2동", "서초3동", "서초4동", "양재1동", "양재2동", "잠원동"],
  성동구: ["금호1가동", "금호2.3가동", "금호4가동", "도선동", "마장동", "사근동", "성수1가1동", "성수1가2동", "성수2가3동", "성수2가1동", "송정동", "왕십리1동", "왕십리2동", "행당1동", "행당2동"],
  성북구: ["길음1동", "길음2동", "돈암1동", "돈암2동", "동선동", "보문동", "석관동", "성북동", "월곡1동", "월곡2동", "장위1동", "장위2동", "장위3동", "정릉1동", "정릉2동", "종암동"],
  송파구: ["가락1동", "가락2동", "가락본동", "거여1동", "거여2동", "마천1동", "마천2동", "문정1동", "문정2동", "방이1동", "방이2동", "삼전동", "석촌동", "송파1동", "송파2동", "오금동", "위례동", "잠실1동", "잠실2동", "잠실3동", "잠실4동", "잠실본동", "장지동", "풍납1동", "풍납2동"],
  양천구: ["목1동", "목2동", "목3동", "목4동", "목5동", "신목동", "신정1동", "신정2동", "신정3동", "신정4동", "신정6동", "신정7동"],
  영등포구: ["대림1동", "대림2동", "대림3동", "당산1동", "당산2동", "도림동", "문래동", "신길1동", "신길2동", "신길3동", "신길4동", "신길5동", "신길6동", "신길7동", "여의동", "영등포동", "영등포본동", "양평1동", "양평2동"],
  용산구: ["갈월동", "동빙고동", "보광동", "서빙고동", "이촌1동", "이촌2동", "이태원1동", "이태원2동", "청파동", "한강로동", "후암동", "원효로1동", "원효로2동", "효창동"],
  은평구: ["갈현1동", "갈현2동", "구산동", "대조동", "불광1동", "불광2동", "수색동", "신사1동", "신사2동", "역촌동", "응암1동", "응암2동", "응암3동", "진관동", "증산동"],
  종로구: ["가회동", "교남동", "무악동", "부암동", "사직동", "삼청동", "숭인1동", "숭인2동", "연건동", "창신1동", "창신2동", "창신3동", "청운효자동", "평창동", "혜화동", "이화동", "종로1·2·3·4가동"],
  중구: ["광희동", "남대문로5가동", "다산동", "덕수궁지킴이", "명동", "무학동", "신당1동", "신당5동", "약수동", "을지로동", "장충동", "청구동", "황학동", "흥인동"],
  중랑구: ["면목본동", "면목2동", "면목3.8동", "면목4동", "면목5동", "면목7동", "망우본동", "망우3동", "묵1동", "묵2동", "상봉1동", "상봉2동", "신내1동", "신내2동", "중화1동", "중화2동"],
};

export function findTimeSlotByCode(code: string | null) {
  return TIME_SLOTS.find((t) => t.code === code) ?? null;
}

export function findAgeGroupByCode(code: string | null) {
  return AGE_GROUPS.find((a) => a.code === code) ?? null;
}

// Onboarding 업종 코드는 TOP5 인사이트 목록과 이름 체계가 달라(예: 카페 ↔ 커피·음료)
// 적정성 메시지 계산 시 이 매핑으로 연결한다.
export const SERVICE_CODE_TO_INSIGHT_NAME: Record<string, string> = {
  CS100001: "한식음식점",
  CS100002: "커피·음료",
  CS100003: "일반의류",
};

export function findInsightByServiceCode(code: string | null) {
  if (!code) return null;
  const name = SERVICE_CODE_TO_INSIGHT_NAME[code];
  return TOP5_INSIGHTS.find((i) => i.name === name) ?? null;
}

export interface RankedShare {
  label: string;
  pct: number;
  rank: number;
  total: number;
}

export function rankTimeSlot(code: string | null): RankedShare | null {
  if (!code) return null;
  const sorted = [...TIME_DISTRIBUTION].sort((a, b) => b.pct - a.pct);
  const idx = sorted.findIndex((t) => t.code === code);
  if (idx === -1) return null;
  return { label: sorted[idx].label, pct: sorted[idx].pct, rank: idx + 1, total: sorted.length };
}

export function rankAgeGroup(code: string | null): RankedShare | null {
  if (!code) return null;
  const sorted = [...AGE_DISTRIBUTION].sort((a, b) => b.pct - a.pct);
  const idx = sorted.findIndex((a) => a.code === code);
  if (idx === -1) return null;
  return { label: sorted[idx].label, pct: sorted[idx].pct, rank: idx + 1, total: sorted.length };
}
