"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

export default function GraphView() {
  const [data, setData] = useState<{ nodes: any[]; links: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState("phone");
  const [searchValue, setSearchValue] = useState("");
  const [mode, setMode] = useState<"full" | "search">("full");

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    fetchGraph("full");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 500,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchGraph = async (queryMode: "full" | "search", type?: string, value?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/graph/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: queryMode, type, value }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch graph data");
      }
      // react-force-graph expects source and target in links
      const links = json.edges.map((e: any) => ({ ...e }));
      const nodes = json.nodes.map((n: any) => ({ ...n }));
      setData({ nodes, links });
      setMode(queryMode);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    fetchGraph("search", searchType, searchValue.trim());
  };

  const getNodeColor = (node: any) => {
    switch (node.type) {
      case "Scammer": return "#ef4444";
      case "Victim": return "#3b82f6";
      case "MuleAccount": return "#f59e0b";
      case "PhoneNumber": return "#10b981";
      default: return "#888888";
    }
  };

  return (
    <div className="glass-card flex flex-col p-4 w-full h-full min-h-[600px]">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 border border-white/20 rounded bg-white/5 text-foreground outline-none focus:border-blue-500"
        >
          <option value="phone" className="text-black">Phone Number</option>
          <option value="mule" className="text-black">Mule Account</option>
          <option value="scammer" className="text-black">Scammer ID</option>
        </select>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter ID or Value"
          className="p-2 border border-white/20 rounded flex-grow bg-white/5 text-foreground outline-none focus:border-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchValue("");
            fetchGraph("full");
          }}
          className="bg-white/10 text-foreground px-4 py-2 rounded hover:bg-white/20 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Graph Area */}
      <div
        className="flex-grow w-full border border-white/10 rounded relative bg-white/5 overflow-hidden"
        ref={containerRef}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 text-foreground">
            Loading graph...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-red-500 font-bold p-4 text-center bg-black/20">
            {error}
          </div>
        )}
        {!loading && !error && data && data.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-foreground/60 bg-black/20">
            {mode === "full" ? "No data yet — run the seed script" : "No results for that search"}
          </div>
        )}
        {!loading && !error && data && data.nodes.length > 0 && (
          <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={data}
            nodeLabel="label"
            nodeColor={getNodeColor}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            nodeRelSize={6}
          />
        )}
      </div>
    </div>
  );
}
