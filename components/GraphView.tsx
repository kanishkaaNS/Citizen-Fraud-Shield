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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 py-3 border rounded-xl bg-transparent outline-none transition-colors text-sm font-medium"
          style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
        >
          <option value="phone" style={{ background: "var(--background-card)" }}>Phone Number</option>
          <option value="mule" style={{ background: "var(--background-card)" }}>Mule Account</option>
          <option value="scammer" style={{ background: "var(--background-card)" }}>Scammer ID</option>
        </select>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter ID or Value"
          className="px-4 py-3 border rounded-xl flex-grow bg-transparent outline-none transition-colors text-sm placeholder:text-muted"
          style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="btn-accent px-6 justify-center text-sm"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchValue("");
            fetchGraph("full");
          }}
          disabled={loading}
          className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "var(--background-card)",
            color: "var(--foreground-muted)",
            border: "1px solid var(--border)",
          }}
        >
          Reset
        </button>
      </div>

      {/* Graph Area */}
      <div
        className="flex-grow w-full border rounded-xl relative overflow-hidden"
        style={{ borderColor: "var(--border)", background: "var(--background-secondary)" }}
        ref={containerRef}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col p-4 z-10 bg-black/20 backdrop-blur-sm">
             <div className="loading-shimmer w-full h-full rounded-xl"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 z-10 bg-black/40 backdrop-blur-sm">
            <div
              className="p-4 rounded-xl animate-fade-in max-w-md w-full"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <p className="flex items-center gap-2 text-sm" style={{ color: "var(--risk-scam)" }}>
                <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </p>
            </div>
          </div>
        )}

        {!loading && !error && data && data.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                style={{
                  background: "rgba(168, 85, 247, 0.1)",
                  color: "#c084fc",
                }}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-medium" style={{ color: "var(--foreground)" }}>
                  {mode === "full" ? "No data yet — run the seed script" : "No results for that search"}
                </p>
              </div>
            </div>
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
