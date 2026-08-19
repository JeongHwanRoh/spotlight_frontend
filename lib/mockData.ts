// 자치구(서울시 25개구) => 프런트 고정값
export const DISTRICTS: string[] = [
  "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
  "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
  "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
];

// 업종 
export const SERVICES = [
  { code: "CS100001", name: "한식음식점" },
  { code: "CS100002", name: "중식음식점" },
  { code: "CS100003", name: "일식음식점" },
  { code: "CS100004", name: "양식음식점" },
  { code: "CS100005", name: "제과점" },
  { code: "CS100006", name: "패스트푸드점" },
  { code: "CS100007", name: "치킨전문점" },
  { code: "CS100008", name: "분식전문점" },
  { code: "CS100009", name: "호프-간이주점" },
  { code: "CS100010", name: "커피-음료" },
  { code: "CS200001", name: "일반교습학원" },
  { code: "CS200002", name: "외국어학원" },
  { code: "CS200003", name: "예술학원" },
  { code: "CS200005", name: "스포츠 강습" },
  { code: "CS200006", name: "일반의원" },
  { code: "CS200007", name: "치과의원" },
  { code: "CS200008", name: "한의원" },
  { code: "CS200016", name: "당구장" },
  { code: "CS200017", name: "골프연습장" },
  { code: "CS200019", name: "PC방" },
  { code: "CS200024", name: "스포츠클럽" },
  { code: "CS200025", name: "자동차수리" },
  { code: "CS200026", name: "자동차미용" },
  { code: "CS200028", name: "미용실" },
  { code: "CS200029", name: "네일숍" },
  { code: "CS200030", name: "피부관리실" },
  { code: "CS200031", name: "세탁소" },
  { code: "CS200032", name: "가전제품수리" },
  { code: "CS200033", name: "부동산중개업" },
  { code: "CS200034", name: "여관" },
  { code: "CS200036", name: "고시원" },  /* NULL 있음(케바케)*/
  { code: "CS200037", name: "노래방" },
  { code: "CS300001", name: "슈퍼마켓" },
  { code: "CS300002", name: "편의점" },
  { code: "CS300003", name: "컴퓨터및주변장치판매" },
  { code: "CS300004", name: "핸드폰" },
  { code: "CS300006", name: "미곡판매" },
  { code: "CS300007", name: "육류판매" },
  { code: "CS300008", name: "수산물판매" },
  { code: "CS300009", name: "청과상" },
  { code: "CS300010", name: "반찬가게" },
  { code: "CS300011", name: "일반의류" },
  { code: "CS300013", name: "유아의류" },
  { code: "CS300014", name: "신발" },
  { code: "CS300015", name: "가방" },
  { code: "CS300016", name: "안경" },
  { code: "CS300017", name: "시계및귀금속" },
  { code: "CS300018", name: "의약품" },
  { code: "CS300019", name: "의료기기" },
  { code: "CS300020", name: "서적" },
  { code: "CS300021", name: "문구" },
  { code: "CS300022", name: "화장품" },
  { code: "CS300024", name: "운동/경기용품" },
  { code: "CS300025", name: "자전거 및 기타운송장비" },
  { code: "CS300026", name: "완구" },
  { code: "CS300027", name: "섬유제품" },
  { code: "CS300028", name: "화초" },
  { code: "CS300029", name: "애완동물" },
  { code: "CS300031", name: "가구" },
  { code: "CS300032", name: "가전제품" },
  { code: "CS300033", name: "철물점" },
  { code: "CS300035", name: "인테리어" },
  { code: "CS300036", name: "조명용품" },
  { code: "CS300043", name: "전자상거래업" },
] as const;

// 시간대 => 프런트 고정값
export const TIME_SLOTS = [
  { code: "t0006", label: "00-06시" },
  { code: "t0611", label: "06-11시" },
  { code: "t1114", label: "11-14시" },
  { code: "t1417", label: "14-17시" },
  { code: "t1721", label: "17-21시" },
  { code: "t2124", label: "21-24시" },
] as const;

// 연령대 => 프런트 고정값
export const AGE_GROUPS = [
  { code: "age10", label: "10대" },
  { code: "age20", label: "20대" },
  { code: "age30", label: "30대" },
  { code: "age40", label: "40대" },
  { code: "age50", label: "50대" },
  { code: "age60p", label: "60대 이상" },
] as const;

 // 분기(추후 데이터 업데이트 시 분기 추가 예정임) => 프런트 고정값
export const QUARTERS = ["2026 Q1"] as const;

// 사이드바 TOP5 업종 순위매길 때 기준 (4가지-분기별, 요일별, 시간대별, 연령대별)
// 분기별(quarter), 요일별(weekday), 시간대별(time), 연령대별(age)
export type RankingBasis = "quarter" | "weekday" | "time" | "age";

export const RANKING_BASIS_TABS: { key: RankingBasis; label: string; anchor: string }[] = [
  { key: "quarter", label: "분기별", anchor: "quarter" },
  { key: "weekday", label: "요일별", anchor: "weekday" },
  { key: "time", label: "시간대별", anchor: "time" },
  { key: "age", label: "연령대별", anchor: "age" },
];

// TOP5 업종의 위험 수준 (위험-보통-양호)
export type RiskLevel = "risk" | "warn" | "good";

// 대시보드의 TOP5 업종 인사이트 카드/모달/적정성 메시지에서 사용할 데이터 구조를 정의
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

// TOP5_인사이트 (여기 데이터들은 향후 백엔드로 가져올 예정)
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

// 요일별 매출분포  (pct는 향후 백엔드로 가져올 예정)
export const WEEKDAY_SALES = [
  { key: "mon", label: "월", pct: 72 },
  { key: "tue", label: "화", pct: 82 },
  { key: "wed", label: "수", pct: 88 },
  { key: "thu", label: "목", pct: 92 },
  { key: "fri", label: "금", pct: 97 },
  { key: "sat", label: "토", pct: 58 },
  { key: "sun", label: "일", pct: 44 },
];

// 시간대별 매출분포 (pct는 향후 백엔드로 가져올 예정)
export const TIME_DISTRIBUTION: { code: string; label: string; pct: number; color: string }[] = [
  { code: "t0006", label: "00-06시", pct: 3, color: "#2354d9" },
  { code: "t0611", label: "06-11시", pct: 12, color: "#2f68ed" },
  { code: "t1114", label: "11-14시", pct: 18, color: "#3d82f2" },
  { code: "t1417", label: "14-17시", pct: 22, color: "#64a6ee" },
  { code: "t1721", label: "17-21시", pct: 31, color: "#9ac8f4" },
  { code: "t2124", label: "21-24시", pct: 14, color: "#c4defb" },
];

// 연령대별 매출분포(pct는 향후 백엔드로 가져올 예정)
export const AGE_DISTRIBUTION: { code: string; label: string; pct: number; color: string }[] = [
  { code: "age10", label: "10대", pct: 4, color: "#2354d9" },
  { code: "age20", label: "20대", pct: 18, color: "#2867e6" },
  { code: "age30", label: "30대", pct: 21, color: "#347ef0" },
  { code: "age40", label: "40대", pct: 24, color: "#60a5fa" },
  { code: "age50", label: "50대", pct: 20, color: "#93c5fd" },
  { code: "age60p", label: "60대+", pct: 13, color: "#bfdbfe" },
];

// 자치구별 행정동 (행정동 필터링, 행정동 기준으로 백엔드로 행정동 가져올 예정)
export const DONG_MAP: Record<string, string[]> = {
  종로구: ["청운효자동", "사직동", "삼청동", "부암동", "평창동", "무악동", "교남동", "가회동", "종로1·2·3·4가동", "종로5·6가동", "이화동", "혜화동", "창신1동", "창신2동", "창신3동", "숭인1동", "숭인2동"],
  중구: ["소공동", "회현동", "명동", "필동", "장충동", "광희동", "을지로동", "신당동", "다산동", "약수동", "청구동", "신당5동", "동화동", "황학동", "중림동"],
  용산구: ["후암동", "용산2가동", "남영동", "청파동", "원효로1동", "원효로2동", "효창동", "용문동", "한강로동", "이촌1동", "이촌2동", "이태원1동", "이태원2동", "한남동", "서빙고동", "보광동"],
  성동구: ["왕십리2동", "왕십리도선동", "마장동", "사근동", "행당1동", "행당2동", "응봉동", "금호1가동", "금호2·3가동", "금호4가동", "옥수동", "성수1가1동", "성수1가2동", "성수2가1동", "성수2가3동", "송정동", "용답동"],
  광진구: ["화양동", "군자동", "중곡1동", "중곡2동", "중곡3동", "중곡4동", "능동", "광장동", "자양1동", "자양2동", "자양3동", "자양4동", "구의1동", "구의2동", "구의3동"],
  동대문구: ["용신동", "제기동", "전농1동", "전농2동", "답십리1동", "답십리2동", "장안1동", "장안2동", "청량리동", "회기동", "휘경1동", "휘경2동", "이문1동", "이문2동"],
  중랑구: ["면목2동", "면목4동", "면목5동", "면목본동", "면목7동", "면목3·8동", "상봉1동", "상봉2동", "중화1동", "중화2동", "묵1동", "묵2동", "망우본동", "망우3동", "신내1동", "신내2동"],
  성북구: ["성북동", "삼선동", "동선동", "돈암1동", "돈암2동", "안암동", "보문동", "정릉1동", "정릉2동", "정릉3동", "정릉4동", "길음1동", "길음2동", "종암동", "월곡1동", "월곡2동", "장위1동", "장위2동", "장위3동", "석관동"],
  강북구: ["삼양동", "미아동", "송중동", "송천동", "삼각산동", "번1동", "번2동", "번3동", "수유1동", "수유2동", "수유3동", "우이동", "인수동"],
  도봉구: ["창1동", "창2동", "창3동", "창4동", "창5동", "도봉1동", "도봉2동", "쌍문1동", "쌍문2동", "쌍문3동", "쌍문4동", "방학1동", "방학2동", "방학3동"],
  노원구: ["월계1동", "월계2동", "월계3동", "공릉1동", "공릉2동", "하계1동", "하계2동", "중계본동", "중계1동", "중계4동", "중계2·3동", "상계1동", "상계2동", "상계3·4동", "상계5동", "상계6·7동", "상계8동", "상계9동", "상계10동"],
  은평구: ["녹번동", "불광1동", "불광2동", "갈현1동", "갈현2동", "구산동", "대조동", "응암1동", "응암2동", "응암3동", "역촌동", "신사1동", "신사2동", "증산동", "수색동", "진관동"],
  서대문구: ["천연동", "북아현동", "충현동", "신촌동", "연희동", "홍제1동", "홍제3동", "홍제2동", "홍은1동", "홍은2동", "남가좌1동", "남가좌2동", "북가좌1동", "북가좌2동"],
  마포구: ["아현동", "공덕동", "도화동", "용강동", "대흥동", "염리동", "신수동", "서강동", "서교동", "합정동", "망원1동", "망원2동", "연남동", "성산1동", "성산2동", "상암동"],
  양천구: ["목1동", "목2동", "목3동", "목4동", "목5동", "신월1동", "신월2동", "신월3동", "신월4동", "신월5동", "신월6동", "신월7동", "신정1동", "신정2동", "신정3동", "신정4동", "신정6동", "신정7동"],
  강서구: ["염창동", "등촌1동", "등촌2동", "등촌3동", "화곡1동", "화곡2동", "화곡3동", "화곡4동", "화곡본동", "화곡6동", "화곡8동", "가양1동", "가양2동", "가양3동", "발산1동", "우장산동", "공항동", "방화1동", "방화2동", "방화3동"],
  구로구: ["신도림동", "구로1동", "구로2동", "구로3동", "구로4동", "구로5동", "가리봉동", "고척1동", "고척2동", "개봉1동", "개봉2동", "개봉3동", "오류1동", "오류2동", "수궁동", "항동"],
  금천구: ["가산동", "독산1동", "독산2동", "독산3동", "독산4동", "시흥1동", "시흥2동", "시흥3동", "시흥4동", "시흥5동"],
  영등포구: ["영등포본동", "영등포동", "여의동", "당산1동", "당산2동", "도림동", "문래동", "양평1동", "양평2동", "신길1동", "신길3동", "신길4동", "신길5동", "신길6동", "신길7동", "대림1동", "대림2동", "대림3동"],
  동작구: ["노량진1동", "노량진2동", "상도1동", "상도2동", "상도3동", "상도4동", "흑석동", "사당1동", "사당2동", "사당3동", "사당4동", "사당5동", "대방동", "신대방1동", "신대방2동"],
  관악구: ["보라매동", "청림동", "성현동", "행운동", "낙성대동", "청룡동", "은천동", "중앙동", "인헌동", "남현동", "서원동", "신원동", "서림동", "신사동", "신림동", "난향동", "조원동", "대학동", "삼성동", "미성동", "난곡동"],
  서초구: ["서초1동", "서초2동", "서초3동", "서초4동", "잠원동", "반포본동", "반포1동", "반포2동", "반포3동", "반포4동", "방배본동", "방배1동", "방배2동", "방배3동", "방배4동", "양재1동", "양재2동", "내곡동"],
  강남구: ["신사동", "논현1동", "논현2동", "압구정동", "청담동", "삼성1동", "삼성2동", "대치1동", "대치2동", "대치4동", "역삼1동", "역삼2동", "도곡1동", "도곡2동", "개포1동", "개포2동", "개포4동", "세곡동", "일원본동", "일원1동", "일원2동", "수서동"],
  송파구: ["풍납1동", "풍납2동", "거여1동", "거여2동", "마천1동", "마천2동", "방이1동", "방이2동", "오륜동", "오금동", "송파1동", "송파2동", "석촌동", "삼전동", "가락본동", "가락1동", "가락2동", "문정1동", "문정2동", "장지동", "위례동", "잠실본동", "잠실2동", "잠실3동", "잠실4동", "잠실6동", "잠실7동"],
  강동구: ["강일동", "상일동", "명일1동", "명일2동", "고덕1동", "고덕2동", "암사1동", "암사2동", "암사3동", "천호1동", "천호2동", "천호3동", "성내1동", "성내2동", "성내3동", "길동", "둔촌1동", "둔촌2동"],
};

// 시간대 코드(t0006 등)를 받아 TIME_SLOTS에서 화면 표시용 시간대 정보를 찾는다.
// 선택값이 없거나 존재하지 않는 코드면 null을 반환한다.
export function findTimeSlotByCode(code: string | null) {
  return TIME_SLOTS.find((t) => t.code === code) ?? null;
}

// 연령대 코드(age20 등)를 받아 AGE_GROUPS에서 화면 표시용 연령대 정보를 찾는다.
// 선택값이 없거나 존재하지 않는 코드면 null을 반환한다.
export function findAgeGroupByCode(code: string | null) {
  return AGE_GROUPS.find((a) => a.code === code) ?? null;
}

// Onboarding 업종 코드는 TOP5 인사이트 목록과 이름 체계가 달라(예: 카페 ↔ 커피·음료)
// 적정성 메시지 계산 시 이 매핑으로 연결한다.
// 향후 TB_SERVICE에서 가져올 것
export const SERVICE_CODE_TO_INSIGHT_NAME: Record<string, string> = {
  CS100001: "한식음식점",
  CS100002: "커피·음료",
  CS100003: "일반의류",
};

// 온보딩에서 선택한 업종 코드(CS100001 등)를 TOP5 인사이트 데이터와 연결한다.
// 업종 코드명과 TOP5 표시명이 다를 수 있어 SERVICE_CODE_TO_INSIGHT_NAME 매핑을 거쳐 찾는다.
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

// 선택한 시간대 코드가 전체 시간대 매출 비중 중 몇 위인지 계산한다.
// pct가 높은 순서로 정렬한 뒤 rank, pct, label, 전체 개수를 반환한다.
export function rankTimeSlot(code: string | null): RankedShare | null {
  if (!code) return null;
  const sorted = [...TIME_DISTRIBUTION].sort((a, b) => b.pct - a.pct);
  const idx = sorted.findIndex((t) => t.code === code);
  if (idx === -1) return null;
  return { label: sorted[idx].label, pct: sorted[idx].pct, rank: idx + 1, total: sorted.length };
}

// 선택한 연령대 코드가 전체 연령대 매출 비중 중 몇 위인지 계산한다.
// pct가 높은 순서로 정렬한 뒤 rank, pct, label, 전체 개수를 반환한다.
export function rankAgeGroup(code: string | null): RankedShare | null {
  if (!code) return null;
  const sorted = [...AGE_DISTRIBUTION].sort((a, b) => b.pct - a.pct);
  const idx = sorted.findIndex((a) => a.code === code);
  if (idx === -1) return null;
  return { label: sorted[idx].label, pct: sorted[idx].pct, rank: idx + 1, total: sorted.length };
}
