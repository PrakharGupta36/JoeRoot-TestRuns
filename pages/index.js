import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState(null);

  const scrapeData = async () => {
    try {
      const response = await axios.get("/api/scrape");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <div className="container">
      <h1>Web Scraper</h1>
      <button onClick={scrapeData}>Scrape Data</button>
      {data && (
        <div>
          <p>Link Name: {data.joeRootName}</p>
          <p>Span Text: {data.spanText}</p>
        </div>
      )}
    </div>
  );
}
