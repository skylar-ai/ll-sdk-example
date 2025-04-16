import { useState, useRef } from "react";
import {
  createTranscriptor,
  Language,
  type TranscriptorInstance,
  type TranscriptorStatus,
} from "@skylar-ai/ll-sdk";
import MicrophoneSelector from "./MicrophoneSelect";

const AudioCapturer = ({ eventToken }: { eventToken: string }) => {
  const [stream, setStream] = useState<MediaStream>();
  const [status, setStatus] = useState<TranscriptorStatus>("stopped");
  const [speakerId, setSpeakerId] = useState<string>();
  const [error, setError] = useState<string>();
  const [muted, setMuted] = useState(false);
  const [subtitleLanguage, setSubtitleLanguage] = useState<
    Language | undefined
  >();

  const [sourceLanguage, setSourceLanguage] = useState<Language | undefined>();

  const transcriptor = useRef<TranscriptorInstance>();

  async function startRecording() {
    if (!stream) return;

    setStatus("starting");
    transcriptor.current = await createTranscriptor({
      eventToken,
      speakerId,
      sourceLanguage: sourceLanguage,
      targetLanguages: subtitleLanguage,
      onStatusChange: setStatus,
      onError: (e) => setError(e.message),
    });

    transcriptor.current.start({ stream });
  }

  function stopRecording() {
    transcriptor.current?.stop();
  }

  function changeSubtitleLanguage(language: Language) {
    console.log("changing subtitle language", language);
    console.log("source language", sourceLanguage);

    transcriptor.current?.updateLanguages({
      sourceLanguage: sourceLanguage || "pt-BR",
      targetLanguages: language,
    });

    setSubtitleLanguage(language);
  }

  function changeSourceLanguage(language: Language) {
    console.log("changing source language", language);
    console.log("subtitle language", subtitleLanguage);

    transcriptor.current?.updateLanguages({
      sourceLanguage: language,
      targetLanguages: subtitleLanguage || [],
    });

    setSourceLanguage(language);
  }

  function toggleMute() {
    setMuted(!muted);
    transcriptor.current?.setMute(muted);
  }

  return (
    <div>
      <h2 className="is-size-2 mb-4 mt-6">Microphone Stream</h2>
      {status && <p>Status: {status}</p>}
      {error && <p>{error}</p>}
      <div className="mt-3 mb-2">
        <label className="label">Speaker ID</label>
        <input
          className="input"
          style={{ maxWidth: "30rem" }}
          type="text"
          value={speakerId}
          onChange={(e) => setSpeakerId(e.target.value)}
        />
      </div>
      <div className="mt-3 mb-2">
        <label className="checkbox">
          <input type="checkbox" checked={muted} onChange={toggleMute} />
          &nbsp; Mute
        </label>
      </div>
      <div className="select">
        <MicrophoneSelector setStream={setStream} />
      </div>
      <div>
        <button
          onClick={status == "stopped" ? startRecording : stopRecording}
          disabled={
            status == "starting" ||
            status == "stopping" ||
            !stream ||
            eventToken.length == 0
          }
          className={`button ${
            status == "running" ? "is-danger" : "is-link"
          } mt-2 ${
            status == "stopping" || status == "starting" ? "is-loading" : ""
          }`}
        >
          {status == "stopped" ? "Start Recording" : "Stop Recording"}
        </button>
      </div>

      <div className="mt-4">
        Se um idioma não for selecionado, o valor inicial do evento é usado.
      </div>
      <div className="is-size-4 mb-1 mt-2">Linguagem de Origem</div>
      <div className="buttons has-addons is-centered">
        <button
          className="button is-link"
          disabled={sourceLanguage == "pt-BR"}
          onClick={() => changeSourceLanguage("pt-BR")}
        >
          Português
        </button>
        <button
          className="button is-link"
          disabled={sourceLanguage == "es-ES"}
          onClick={() => changeSourceLanguage("es-ES")}
        >
          Espanhol
        </button>
        <button
          className="button is-link"
          disabled={sourceLanguage == "en-US"}
          onClick={() => changeSourceLanguage("en-US")}
        >
          Inglês
        </button>
      </div>
      <div className="is-size-4 mb-1 mt-2">Linguagem das Legendas</div>
      <div className="buttons has-addons is-centered">
        <button
          className="button is-link"
          disabled={subtitleLanguage == "pt-BR"}
          onClick={() => changeSubtitleLanguage("pt-BR")}
        >
          Português
        </button>
        <button
          className="button is-link"
          disabled={subtitleLanguage == "es-ES"}
          onClick={() => changeSubtitleLanguage("es-ES")}
        >
          Espanhol
        </button>
        <button
          className="button is-link"
          disabled={subtitleLanguage == "en-US"}
          onClick={() => changeSubtitleLanguage("en-US")}
        >
          Inglês
        </button>
      </div>
    </div>
  );
};

export default AudioCapturer;
