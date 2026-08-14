"use client";

import { useEffect, useRef, useState } from "react";
import { DONG_MAP } from "@/lib/mockData";

// 채팅 메시지 한 건의 타입 정의
// sender: "bot"(AI) 또는 "user"(사람)
// content: 텍스트 외에 JSX도 담을 수 있도록 ReactNode 사용
interface ChatMessage {
  id: number;
  sender: "bot" | "user";
  content: React.ReactNode;
}

// 메시지 고유 ID를 컴포넌트 외부에서 관리 (리렌더링 시에도 값이 초기화되지 않음)
let messageId = 0;

// district, dongName: 상위 컴포넌트(대시보드)에서 선택된 자치구명/행정동명을 props로 받음
export default function Chatbot({ district, dongName }: { district: string; dongName: string }) {
  // 챗봇 창 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);
  // 현재 보여줄 화면: "setup"(행정동 선택) | "chat"(대화 화면)
  const [screen, setScreen] = useState<"setup" | "chat">("setup");
  // 선택된 행정동
  const [dong, setDong] = useState("");
  // 채팅 메시지 목록
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // 텍스트 입력창 값
  const [inputValue, setInputValue] = useState("");
  // 메시지 목록 맨 아래 빈 div를 가리키는 ref (자동 스크롤용)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // 챗봇 오버레이(창 전체)를 가리키는 ref (드래그 이동용)
  const overlayRef = useRef<HTMLDivElement>(null);

  // 선택한 자치구에 속한 행정동 목록 (없으면 빈 배열)
  const dongOptions = DONG_MAP[district] ?? [];
  
  // welcome message 내용 (첫 메시지)
  function createWelcomeMessage(selectedDong: string): ChatMessage {
    return {
      id: messageId++,
      sender: "bot",
      content: (
        <>
          <span className="phase-chip">AI 상권 챗봇</span>
          <br />
          {`"${selectedDong} 카페 창업 어때요?"`}
          <br />
          <br />
          안녕하세요! <strong>{district} {selectedDong}</strong> 지역 상권 분석 AI입니다. 창업 예정 업종, 타겟 고객,
          경쟁 현황 등 궁금한 점을 자유롭게 물어보세요.
          <br />
          <br />
          <span className="chat-hint">
            ※ 현재 UI 템플릿 단계입니다. 실제 답변은 LangGraph + 벡터DB + 파인튜닝 모델 연동 후 제공됩니다.
          </span>
        </>
      ),
    };
  }

  // [자치구/행정동 변경 감지] 대시보드에서 선택한 행정동이 있으면 챗봇 내부 선택값에 반영
  useEffect(() => {
    setDong(dongName);
  }, [district, dongName]);

  // [자동 스크롤] 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // [키보드 단축키] ESC 키를 누르면 챗봇 창을 닫음
  // 컴포넌트 마운트 시 1회 등록, 언마운트 시 제거(cleanup)
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // 챗봇 열기: 화면을 setup(행정동 선택)으로 초기화한 뒤 오버레이를 표시
  function openChatbot() {
    const hasDashboardDong = dongName !== ""; // 동이 선택된 상태인지 여부 (동 있으면 true, 없으면 false)
    const nextDong = hasDashboardDong ? dongName : ""; // 동이 선택된 상태이면 nextDong에 해당 동 저장, 아니면 빈 값 리턴 

    setIsOpen(true); // 채팅창 open
    setDong(nextDong); // 대시보드에서 선택된 동이 nextDong에 저장되고 해당 변수가 dong 변수에 저장됨
    setScreen(hasDashboardDong ? "chat" : "setup"); // 동 선택된 상태면 chat 모드로, 아니면 setup 모드로
    setMessages(hasDashboardDong ? [createWelcomeMessage(nextDong)] : []); // 동 선택된 상태면 바로 welcome message 띄우기
  }

  // 챗봇 닫기
  function closeChatbot() {
    setIsOpen(false);
  }

  // [드래그 이동] 챗봇이 열릴 때(isOpen=true)마다 헤더를 잡아 창을 드래그할 수 있게 설정
  // isOpen이 false가 되거나 컴포넌트가 언마운트될 때 cleanup으로 리스너를 모두 제거
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    // 드래그 시작 시점의 포인터 좌표 및 오버레이 위치를 저장하는 변수
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    // pointermove: 드래그 중 오버레이 위치를 계산해서 이동
    // Math.min/max로 화면 밖으로 벗어나지 않도록 경계 처리
    const moveChatbot = (e: PointerEvent) => {
      const nextLeft = startLeft + e.clientX - startX;
      const nextTop = startTop + e.clientY - startY;
      overlay.style.left = `${Math.min(Math.max(nextLeft, 0), window.innerWidth - overlay.offsetWidth)}px`;
      overlay.style.top = `${Math.min(Math.max(nextTop, 0), window.innerHeight - overlay.offsetHeight)}px`;
    };

    // pointerup: 드래그 종료 시 "dragging" 클래스를 제거하고 이벤트 리스너 해제
    const stopDrag = () => {
      overlay.classList.remove("dragging");
      document.removeEventListener("pointermove", moveChatbot);
      document.removeEventListener("pointerup", stopDrag);
    };

    // pointerdown: 드래그 시작
    // 버튼·입력창·링크 등 인터랙티브 요소를 클릭한 경우에는 드래그를 무시
    const startDrag = (e: Event) => {
      const pe = e as PointerEvent;
      if (pe.target && (pe.target as Element).closest("button, input, select, textarea, a")) return;

      // 현재 오버레이의 화면상 위치를 기준점으로 저장
      const rect = overlay.getBoundingClientRect();
      startX = pe.clientX;
      startY = pe.clientY;
      startLeft = rect.left;
      startTop = rect.top;

      // CSS right/bottom 속성 대신 left/top으로 위치를 제어하도록 전환
      overlay.style.left = `${rect.left}px`;
      overlay.style.top = `${rect.top}px`;
      overlay.style.right = "auto";
      overlay.style.bottom = "auto";
      overlay.classList.add("dragging");

      document.addEventListener("pointermove", moveChatbot);
      document.addEventListener("pointerup", stopDrag);
    };

    // setup/chat 두 화면 모두 ".chatbot-header"가 존재하므로 querySelectorAll로 모두 선택
    const headers = overlay.querySelectorAll<HTMLElement>(".chatbot-header");
    headers.forEach((h) => h.addEventListener("pointerdown", startDrag));

    // cleanup: isOpen이 false로 바뀌거나 컴포넌트 언마운트 시 모든 리스너 제거
    return () => {
      headers.forEach((h) => h.removeEventListener("pointerdown", startDrag));
      document.removeEventListener("pointermove", moveChatbot);
      document.removeEventListener("pointerup", stopDrag);
    };
  }, [isOpen]);

  // 채팅 시작: 선택된 행정동이 있을 때만 동작
  // 봇의 첫 인사 메시지를 삽입하고 chat 화면으로 전환
  function startChat() {
    if (!dong) return;

    setMessages([createWelcomeMessage(dong)]);
    setScreen("chat");
  }

  // 메시지 전송: 입력창이 비어 있으면 무시
  // 사용자 메시지를 즉시 추가하고, 500ms 후 봇의 임시 응답을 추가 (Phase 2 전까지 더미 응답)
  function sendMessage() {
    const text = inputValue.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { id: messageId++, sender: "user", content: text }]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: messageId++,
          sender: "bot",
          content: (
            <>
              <span className="phase-chip">Phase 2 예정</span>
              <br />
              AI 답변 기능은 LangGraph · 벡터DB · 파인튜닝 모델 연동 후 활성화됩니다.
              <br />
              <span className="chat-hint">질문: &quot;{text}&quot;</span>
            </>
          ),
        },
      ]);
    }, 500);
  }

  return (
    <>
      {/* FAB(Floating Action Button): 화면 우하단 고정 버튼으로 챗봇을 열기 */}
      <button className="chatbot-fab" type="button" aria-label="AI 챗봇 열기" onClick={openChatbot}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* 챗봇 오버레이: isOpen일 때 "active" 클래스로 표시, ref로 드래그 위치 제어 */}
      <div ref={overlayRef} className={`chatbot-overlay ${isOpen ? "active" : ""}`} aria-hidden={!isOpen}>

        {/* setup 화면: 행정동 선택 */}
        {screen === "setup" ? (
          <div id="setup-screen">
            <header className="chatbot-header">
              <div className="chatbot-header-info">
                <h2>AI 상권 정보 알리미 챗봇</h2>
              </div>
              <button className="chatbot-close-btn" aria-label="닫기" onClick={closeChatbot}>
                ×
              </button>
            </header>

            <div className="chatbot-setup-body">
              <div className="setup-icon-wrap">
                <p>분석할 행정동을 선택하고 채팅을 시작하세요</p>
              </div>

              <div className="chatbot-setup-card">
                {/* 상위에서 선택된 자치구명 표시 (읽기 전용 배지) */}
                <div className="chatbot-setup-field">
                  <div className="chatbot-district-badge">{district}</div>
                </div>

                {/* 해당 자치구의 행정동 목록을 드롭다운으로 표시 */}
                <div className="chatbot-setup-field">
                  <select
                    className="chatbot-dong-select"
                    value={dong}
                    onChange={(e) => setDong(e.target.value)}
                  >
                    <option value="">행정동을 선택하세요</option>
                    {dongOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 행정동 미선택 시 버튼 비활성화 */}
              <button className="chatbot-start-btn" type="button" disabled={!dong} onClick={startChat}>
                채팅 시작하기
              </button>
            </div>
          </div>

        ) : (

          /*  screen != "setup"인 경우 => screen =="chat"
          chat 화면: 메시지 목록 + 입력창 */
          <div className="chatbot-chat">
            <header className="chatbot-header">
              <button className="chatbot-back-btn" type="button" onClick={() => setScreen("setup")}>
                ‹ 행정동 변경
              </button>
              <div className="chatbot-header-info">
                <h2>
                  {district} · {dong}
                </h2>
                <p>AI 상권 챗봇</p>
              </div>
              <button className="chatbot-close-btn" aria-label="닫기" onClick={closeChatbot}>
                ×
              </button>
            </header>

            {/* 메시지 목록: user/bot 여부에 따라 말풍선 정렬이 달라짐 */}
            <div className="chat-messages">
              {messages.map((m) => (
                <div key={m.id} className={`chat-msg-wrap ${m.sender === "user" ? "user" : ""}`}>
                  <div className="chat-sender">{m.sender === "user" ? "나" : "🤖 SpotLight AI"}</div>
                  <div className={`chat-bubble ${m.sender}`}>{m.content}</div>
                </div>
              ))}
              {/* 자동 스크롤 앵커: 새 메시지 추가 시 이 요소로 스크롤 이동 */}
              <div ref={messagesEndRef} />
            </div>

            {/* 입력창: Enter 키 또는 전송 버튼으로 메시지 전송 */}
            <div className="chat-input-area">
              <input
                className="chat-input"
                type="text"
                placeholder="질문을 입력하세요 (예: 이 동네 카페 창업 어때요?)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button className="chat-send-btn" type="button" onClick={sendMessage}>
                전송
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
