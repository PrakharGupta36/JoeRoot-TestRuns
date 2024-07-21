import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const SACHIN_RUNS = 15921;

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/scrape");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <ClipLoader color="#ffffff" size={150} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <p>Failed to load data</p>
      </div>
    );
  }

  const joeRuns = parseInt(data.spanText, 10);
  const runsNeeded = SACHIN_RUNS - joeRuns + 1;
  const message =
    joeRuns > SACHIN_RUNS
      ? "Joe Root is the highest run getter in Test Cricket."
      : `Joe Root needs ${runsNeeded} runs to surpass Sachin Tendulkar's test runs.`;

  return (
    <div className="container">
      <p>{message}</p>
    </div>
  );
}
