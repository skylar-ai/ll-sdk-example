import { useRef, useState } from "react";
import {
  createSubtitleListener,
  Language,
  Subtitle,
  type SubtitleListenerInstance,
  type SubtitleListenerStatus,
} from "@skylar-ai/ll-sdk";

const icons: Record<Language, string> = {
  "pt-BR": "🇧🇷",
  "en-US": "🇺🇸",
  "es-ES": "🇪🇸",
};

export default function Subtitler({ eventToken }: { eventToken: string }) {
  const [subtitles, setSubtitles] = useState<Subtitle[]>();
  const subtitleListener = useRef<SubtitleListenerInstance>();
  const [status, setStatus] = useState<SubtitleListenerStatus>("inactive");
  const [error, setError] = useState<string>();

  async function startSubtitling() {
    if (!eventToken) return;

    if (!subtitleListener.current) {
      subtitleListener.current = await createSubtitleListener({
        eventToken,
        onSubtitle: (subtitle) =>
          setSubtitles((prev) => [...(prev || []), subtitle]),
        onStatusChange: setStatus,
        onError: (e) => setError(e.message),
      });
      return;
    }

    subtitleListener.current.start();
  }

  function stopSubtitling() {
    subtitleListener.current?.stop();
  }

  return (
    <main className="block container mt-6 has-text-centered	">
      <h2 className="is-size-2 mb-2">Subtitles</h2>
      <p>Status: {status}</p>
      {error && <p className="has-text-danger">Error: {error}</p>}
      <button
        className={`button ${status === "inactive" ? "is-link" : "is-danger"}`}
        onClick={status === "inactive" ? startSubtitling : stopSubtitling}
        disabled={eventToken.length == 0}
      >
        {status === "inactive" ? "Start Subtitling" : "Stop Subtitling"}
      </button>
      <div
        style={{
          maxHeight: "16rem",
          overflowY: "auto",
          maxWidth: "600px",
          marginInline: "auto",
          textAlign: "left",
        }}
      >
        {subtitles?.map((subtitle, index) => (
          <div key={index}>
            <p className="mt-4">
              {subtitle.time.toLocaleDateString()}
              {subtitle.texts.map((text) => (
                <div key={text.language}>
                  {icons[text.language]} {text.text}
                </div>
              ))}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}