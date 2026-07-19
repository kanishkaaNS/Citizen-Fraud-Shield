import { NextRequest } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { mode, type, value } = body;
    let { hops = 2 } = body;

    if (!mode || (mode !== "full" && mode !== "search")) {
      return Response.json({ error: "mode must be 'full' or 'search'" }, { status: 400 });
    }

    if (mode === "search" && !type) {
      return Response.json({ error: "type is required for search mode" }, { status: 400 });
    }

    hops = Math.min(Math.max(1, Number(hops) || 2), 3);

    const nodesMap = new Map();
    const edgesMap = new Map();

    const addNode = (n: any) => {
      if (!n || !n.properties) return;
      nodesMap.set(n.elementId, {
        id: n.properties.id,
        type: n.labels?.[0] || "Unknown",
        label: n.properties.label,
        ...n.properties
      });
    };

    const addEdgeByNodes = (r: any, n1: any, n2: any) => {
      if (!r || !n1 || !n2) return;
      const startNode = n1.elementId === r.startNodeElementId ? n1 : n2;
      const endNode = n1.elementId === r.endNodeElementId ? n1 : n2;
      edgesMap.set(r.elementId, {
        source: startNode.properties.id,
        target: endNode.properties.id,
        type: r.type,
      });
    };

    if (mode === "full") {
      const records = await runQuery(`MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 150`);
      records.forEach((record) => {
        const n = record.get("n");
        const r = record.get("r");
        const m = record.get("m");
        addNode(n);
        addNode(m);
        addEdgeByNodes(r, n, m);
      });
    } else if (mode === "search") {
      if (!value) {
        return Response.json({ nodes: [], edges: [] }, { status: 200 });
      }

      if (type === "phone") {
        try {
          // Try APOC first
          const records = await runQuery(
            `MATCH (p:PhoneNumber {id: $value}) CALL apoc.path.subgraphAll(p, {maxLevel: $hops}) YIELD nodes, relationships RETURN nodes, relationships`,
            { value, hops }
          );
          if (records.length > 0) {
            const rowNodes = records[0].get("nodes");
            const rowRels = records[0].get("relationships");
            rowNodes.forEach(addNode);
            rowRels.forEach((r: any) => {
               const startNode = rowNodes.find((n: any) => n.elementId === r.startNodeElementId);
               const endNode = rowNodes.find((n: any) => n.elementId === r.endNodeElementId);
               if (startNode && endNode) {
                 addEdgeByNodes(r, startNode, endNode);
               }
            });
          }
        } catch (err: any) {
          // Fallback if APOC fails or is missing
          const records = await runQuery(
            `MATCH path = (p:PhoneNumber {id: $value})-[*1..2]-(connected) RETURN path`,
            { value }
          );
          records.forEach((record) => {
            const path = record.get("path");
            path.segments.forEach((segment: any) => {
              addNode(segment.start);
              addNode(segment.end);
              addEdgeByNodes(segment.relationship, segment.start, segment.end);
            });
          });
        }
      } else if (type === "mule") {
        const records = await runQuery(
          `MATCH path = (m:MuleAccount {id: $value})-[*1..2]-(connected) RETURN path`,
          { value }
        );
        records.forEach((record) => {
          const path = record.get("path");
          path.segments.forEach((segment: any) => {
            addNode(segment.start);
            addNode(segment.end);
            addEdgeByNodes(segment.relationship, segment.start, segment.end);
          });
        });
      } else if (type === "scammer") {
        const records = await runQuery(
          `MATCH (s:Scammer {id: $value})-[r]-(connected) RETURN s, r, connected`,
          { value }
        );
        records.forEach((record) => {
          const s = record.get("s");
          const r = record.get("r");
          const connected = record.get("connected");
          addNode(s);
          addNode(connected);
          addEdgeByNodes(r, s, connected);
        });
      }
    }

    return Response.json({
      nodes: Array.from(nodesMap.values()),
      edges: Array.from(edgesMap.values()),
    });
  } catch (error) {
    console.error("Graph query failed:", error);
    return Response.json(
      { error: "Graph service unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
