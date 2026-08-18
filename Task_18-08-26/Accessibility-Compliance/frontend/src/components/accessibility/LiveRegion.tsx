interface LiveRegionProps {
  message: string;
  assertive?: boolean;
}

const LiveRegion = ({
  message,
  assertive = false,
}: LiveRegionProps) => {
  return (
    <div
      className="visually-hidden"
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

export default LiveRegion;