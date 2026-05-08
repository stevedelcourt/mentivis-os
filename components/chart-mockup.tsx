interface ChartMockupProps {
  data: {
    title: string;
    value: string;
    v1: string;
    v2: string;
    dateStart: string;
    dateEnd: string;
  };
}

export function ChartMockup({ data }: ChartMockupProps) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: 24,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
    }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 4 }}>{data.title}</p>
        <p style={{ fontSize: 24, fontWeight: 600, color: "#1a1a1a" }}>{data.value}</p>
      </div>

      <div style={{ position: "relative", height: 120 }}>
        <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="30" x2="400" y2="30" stroke="#f0f0f0" strokeWidth="1" />
          <line x1="0" y1="60" x2="400" y2="60" stroke="#f0f0f0" strokeWidth="1" />
          <line x1="0" y1="90" x2="400" y2="90" stroke="#f0f0f0" strokeWidth="1" />

          {/* Y-axis labels */}
          <text x="4" y="34" fontSize="10" fill="#999">100%</text>
          <text x="4" y="64" fontSize="10" fill="#999">50%</text>
          <text x="4" y="94" fontSize="10" fill="#999">0%</text>

          {/* V1 Line (Orange) */}
          <path
            d="M 40 40 Q 80 35, 120 38 T 200 30 T 280 35 T 360 45"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
          />
          <path
            d="M 40 40 Q 80 35, 120 38 T 200 30 T 280 35 T 360 45 L 360 120 L 40 120 Z"
            fill="url(#gradV1)"
            opacity="0.1"
          />

          {/* V2 Line (Blue) */}
          <path
            d="M 40 70 Q 80 65, 120 75 T 200 60 T 280 70 T 360 80"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <path
            d="M 40 70 Q 80 65, 120 75 T 200 60 T 280 70 T 360 80 L 360 120 L 40 120 Z"
            fill="url(#gradV2)"
            opacity="0.1"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="gradV1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradV2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip */}
        <div style={{
          position: "absolute",
          top: 20,
          left: 100,
          background: "#ffffff",
          borderRadius: 12,
          padding: "8px 12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          fontSize: 11,
          fontWeight: 500,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316" }} />
            <span style={{ color: "#1a1a1a" }}>{data.v1}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
            <span style={{ color: "#1a1a1a" }}>{data.v2}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, color: "#999" }}>
        <span>{data.dateStart}</span>
        <span>{data.dateEnd}</span>
      </div>
    </div>
  );
}
