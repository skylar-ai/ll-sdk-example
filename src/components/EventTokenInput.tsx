export default function EventTokenInput({
  eventToken,
  onChange,
}: {
  eventToken: string;
  onChange: (eventToken: string) => void;
}) {
  return (
    <div className="field mx-auto mt-4" style={{ maxWidth: "30rem" }}>
      <label className="label">Forneça o Event Token</label>
      <div className="control">
        <input
          className="input"
          type="text"
          value={eventToken}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
