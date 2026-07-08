const Analytics = () => {
  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>Performance Analytics</h1>

      <table
        border={1}
        cellPadding={12}
        style={{
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Metric</th>
            <th>Before</th>
            <th>After</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Rendered Items</td>
            <td>10000</td>
            <td>20-30</td>
          </tr>

          <tr>
            <td>Rendering Speed</td>
            <td>Slow</td>
            <td>Fast</td>
          </tr>

          <tr>
            <td>Memory Usage</td>
            <td>High</td>
            <td>Low</td>
          </tr>

          <tr>
            <td>Bundle Size</td>
            <td>Large</td>
            <td>Optimized</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px" }}>
        Optimizations Used
      </h2>

      <ul>
        <li> React.memo</li>
        <li> useMemo</li>
        <li> useCallback</li>
        <li> React.lazy</li>
        <li> Suspense</li>
        <li> react-virtuoso</li>
      </ul>
    </div>
  );
};

export default Analytics;