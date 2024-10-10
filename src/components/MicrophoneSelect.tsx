import { useState, useEffect } from "react";

function MicrophoneSelector({
  setStream,
}: {
  setStream: (stream: MediaStream) => void;
}) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>();

  useEffect(() => {
    // Request permission to use the microphone and get available devices
    const getMicrophoneStream = async (deviceId?: string) => {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      });
      setStream(audioStream);
    };

    const getAudioDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      setDevices(audioDevices);
    };

    getMicrophoneStream(selectedDeviceId);
    getAudioDevices();
  }, [selectedDeviceId, setStream]);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(event.target.value);
  };

  return (
    <div className="select">
      <select onChange={handleDeviceChange} value={selectedDeviceId}>
        <option value="">Select a microphone</option>
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Microphone ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MicrophoneSelector;
