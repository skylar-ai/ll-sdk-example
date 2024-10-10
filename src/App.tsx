import { testMessage } from "@skylar-ai/ll-sdk";
import AudioCapturer from "./components/AudioCapturer";
import Subtitler from "./components/Subtitler";
import EventTokenInput from "./components/EventTokenInput";
import { useState } from "react";

function App() {
  const [eventToken, setEventToken] = useState("");

  const message = testMessage();
  return (
    <main className="block container mt-6 has-text-centered">
      <p>
        Mensagem do SDK: <strong>{message}</strong>
      </p>
      <EventTokenInput eventToken={eventToken} onChange={setEventToken} />
      <div className="mb-6">
        <AudioCapturer eventToken={eventToken} />
      </div>
      <div className="mb-6">
        <Subtitler eventToken={eventToken} />
      </div>
    </main>
  );
}

export default App;
