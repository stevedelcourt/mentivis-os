"use client";

export default function ErrorBoundary({ error }: { error: Error & { digest?: string } }) {
  return (
    <div style={{ padding: 40, fontFamily: "monospace" }}>
      <h1>500 — Server Error</h1>
      <p><strong>Message:</strong> {error.message}</p>
      <p><strong>Stack:</strong></p>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{error.stack}</pre>
      {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
    </div>
  );
}
