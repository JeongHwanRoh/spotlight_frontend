"use client";

import { useEffect, useRef, useState } from "react";
import { DONG_MAP } from "@/lib/mockData";

interface ChatMessage {
  id: number;
  sender: "bot" | "user";
  content: React.ReactNode;
}

let messageId = 0;

export default function Chatbot({ district }: { district: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreen] = useState<"setup" | "chat">("setup");
  const [dong, setDong] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dongOptions = DONG_MAP[district] ?? [];

  useEffect(() => {
    // 자치구가 바뀌면(대시보드 헤더에서 변경) 행정동 선택을 초기화한다.
    setDong("");
  }, [district]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function openChatbot() {
    setIsOpen(true);
    setScreen("setup");
  }

  function closeChatbot() {
    setIsOpen(false);
  }

  function startChat() {
    if (!dong) return;

    setMessages([
      {
        id: messageId++,
        sender: "bot",
        content: (
          <>
            <span className="phase-chip">AI 상권 챗봇</span>
            <br />
            {`"${dong} 카페 창업 어때요?"`}
            <br />
            <br />
            안녕하세요! <strong>{district} {dong}</strong> 지역 상권 분석 AI입니다. 창업 예정 업종, 타겟 고객,
            경쟁 현황 등 궁금한 점을 자유롭게 물어보세요.
            <br />
            <br />
            <span className="chat-hint">
              ※ 현재 UI 템플릿 단계입니다. 실제 답변은 LangGraph + 벡터DB + 파인튜닝 모델 연동 후 제공됩니다.
            </span>
          </>
        ),
      },
    ]);
    setScreen("chat");
  }

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
      <button className="chatbot-fab" type="button" aria-label="AI 챗봇 열기" onClick={openChatbot}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <div className={`chatbot-overlay ${isOpen ? "active" : ""}`} aria-hidden={!isOpen}>
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
                <div className="chatbot-setup-field">
                  <div className="chatbot-district-badge">{district}</div>
                </div>

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

              <button className="chatbot-start-btn" type="button" disabled={!dong} onClick={startChat}>
                채팅 시작하기
              </button>
            </div>
          </div>
        ) : (
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

            <div className="chat-messages">
              {messages.map((m) => (
                <div key={m.id} className={`chat-msg-wrap ${m.sender === "user" ? "user" : ""}`}>
                  <div className="chat-sender">{m.sender === "user" ? "나" : "🤖 SpotLight AI"}</div>
                  <div className={`chat-bubble ${m.sender}`}>{m.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

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
