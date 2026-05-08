interface ChatMockupProps {
  messages: {
    user1: string;
    agent: string;
    user2: string;
    agent2: string;
    success: string;
  };
}

export function ChatMockup({ messages }: ChatMockupProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          padding: "10px 16px",
          borderRadius: 20,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#ffffff",
          fontSize: 13,
          fontWeight: 400,
          lineHeight: 1.4,
        }}>
          {messages.user1}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div style={{
          padding: "10px 16px",
          borderRadius: 20,
          background: "#ffffff",
          color: "#1a1a1a",
          fontSize: 13,
          fontWeight: 400,
          lineHeight: 1.4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          {messages.agent}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          padding: "10px 16px",
          borderRadius: 20,
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#ffffff",
          fontSize: 13,
          fontWeight: 400,
          lineHeight: 1.4,
        }}>
          {messages.user2}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div style={{
          padding: "10px 16px",
          borderRadius: 20,
          background: "#ffffff",
          color: "#1a1a1a",
          fontSize: 13,
          fontWeight: 400,
          lineHeight: 1.4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          {messages.agent2}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#6366f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 11,
          fontWeight: 600,
        }}>
          S
        </div>
        <div style={{
          padding: "8px 14px",
          borderRadius: 20,
          background: "#ffffff",
          color: "#1a1a1a",
          fontSize: 13,
          fontWeight: 400,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          {messages.success}
        </div>
      </div>
    </div>
  );
}
