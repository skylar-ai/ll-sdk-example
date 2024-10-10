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
  const [error, setError] = useState<string>();
  const [language, setLanguage] = useState<Language | undefined>();

  const transcriptor = useRef<TranscriptorInstance>();

  async function startRecording() {
    if (!stream) return;

    if (!transcriptor.current) {
      setStatus("starting");
      transcriptor.current = await createTranscriptor({
        eventToken,
        speakerId: "renato",
        sourceLanguage: "pt-BR",
        targetLanguages: language,
        onStatusChange: setStatus,
        onError: (e) => setError(e.message),
      });
    }

    transcriptor.current?.start({ stream });
  }

  function stopRecording() {
    transcriptor.current?.stop();
  }

  function changeLanguage(language: Language) {
    transcriptor.current?.updateLanguages({
      sourceLanguage: "pt-BR",
      targetLanguages: language,
    });

    setLanguage(language);
  }

  return (
    <div>
      <h2 className="is-size-2 mb-4 mt-6">Microphone Stream</h2>
      {status && <p>Status: {status}</p>}
      {error && <p>{error}</p>}
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
      <div className="buttons has-addons is-centered">
        <button
          className="button is-link"
          disabled={language == "pt-BR"}
          onClick={() => changeLanguage("pt-BR")}
        >
          Português
        </button>
        <button
          className="button is-link"
          disabled={language == "es-ES"}
          onClick={() => changeLanguage("es-ES")}
        >
          Espanhol
        </button>
        <button
          className="button is-link"
          disabled={language == "en-US"}
          onClick={() => changeLanguage("en-US")}
        >
          Inglês
        </button>
      </div>
    </div>
  );
};

export default AudioCapturer;
