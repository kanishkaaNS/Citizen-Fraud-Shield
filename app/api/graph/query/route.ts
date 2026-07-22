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

    // MOCK MODE FOR LOCAL TESTING
    if (process.env.NEO4J_PASSWORD === "your_neo4j_password_here") {
      if (mode === "full") {
        return Response.json({
          nodes: [
            { id: 'scammer_a', type: 'Scammer', label: 'Alias: John' },
            { id: 'scammer_b', type: 'Scammer', label: 'Alias: Mike' },
            { id: 'scammer_c', type: 'Scammer', label: 'Alias: Dave' },
            { id: 'scammer_d', type: 'Scammer', label: 'Alias: Sam' },
            { id: 'victim_1', type: 'Victim', label: 'Victim-014' },
            { id: 'victim_2', type: 'Victim', label: 'Victim-015' },
            { id: 'victim_3', type: 'Victim', label: 'Victim-016' },
            { id: 'victim_4', type: 'Victim', label: 'Victim-017' },
            { id: 'victim_5', type: 'Victim', label: 'Victim-018' },
            { id: 'victim_6', type: 'Victim', label: 'Victim-019' },
            { id: 'mule_1', type: 'MuleAccount', label: 'XXXX-4471' },
            { id: 'mule_2', type: 'MuleAccount', label: 'XXXX-1234' },
            { id: 'mule_3', type: 'MuleAccount', label: 'XXXX-5678' },
            { id: 'mule_4', type: 'MuleAccount', label: 'XXXX-9999' },
            { id: 'phone_1', type: 'PhoneNumber', label: '+91-XXXXX-891' },
            { id: 'phone_2', type: 'PhoneNumber', label: '+91-XXXXX-892' },
            { id: 'phone_3', type: 'PhoneNumber', label: '+91-XXXXX-893' },
            { id: 'phone_4', type: 'PhoneNumber', label: '+91-XXXXX-894' },
            { id: 'phone_5', type: 'PhoneNumber', label: '+91-XXXXX-895' }
          ],
          edges: [
            { source: 'scammer_a', target: 'phone_1', type: 'LINKED_TO' },
            { source: 'scammer_b', target: 'phone_1', type: 'LINKED_TO' },
            { source: 'scammer_a', target: 'phone_2', type: 'LINKED_TO' },
            { source: 'scammer_c', target: 'phone_3', type: 'LINKED_TO' },
            { source: 'scammer_d', target: 'phone_4', type: 'LINKED_TO' },
            { source: 'scammer_d', target: 'phone_5', type: 'LINKED_TO' },
            { source: 'scammer_a', target: 'mule_1', type: 'LINKED_TO' },
            { source: 'scammer_c', target: 'mule_1', type: 'LINKED_TO' },
            { source: 'scammer_b', target: 'mule_2', type: 'LINKED_TO' },
            { source: 'scammer_d', target: 'mule_3', type: 'LINKED_TO' },
            { source: 'scammer_d', target: 'mule_4', type: 'LINKED_TO' },
            { source: 'victim_1', target: 'scammer_a', type: 'REPORTED' },
            { source: 'victim_2', target: 'scammer_b', type: 'REPORTED' },
            { source: 'victim_3', target: 'scammer_a', type: 'REPORTED' },
            { source: 'victim_4', target: 'scammer_c', type: 'REPORTED' },
            { source: 'victim_5', target: 'scammer_d', type: 'REPORTED' },
            { source: 'victim_6', target: 'scammer_d', type: 'REPORTED' },
            { source: 'mule_1', target: 'victim_1', type: 'RECEIVED_FROM' },
            { source: 'mule_1', target: 'victim_3', type: 'RECEIVED_FROM' },
            { source: 'mule_2', target: 'victim_2', type: 'RECEIVED_FROM' },
            { source: 'mule_3', target: 'victim_5', type: 'RECEIVED_FROM' },
            { source: 'mule_4', target: 'victim_6', type: 'RECEIVED_FROM' },
            { source: 'mule_1', target: 'victim_4', type: 'RECEIVED_FROM' }
          ]
        });
      } else {
        // Mock search response
        return Response.json({
          nodes: [
            { id: "phone_search", type: "PhoneNumber", label: value || "+91-TEST" },
            { id: "scammer_mock", type: "Scammer", label: "Mock Scammer" },
            { id: "victim_mock", type: "Victim", label: "Mock Victim" }
          ],
          edges: [
            { source: "scammer_mock", target: "phone_search", type: "LINKED_TO" },
            { source: "victim_mock", target: "scammer_mock", type: "REPORTED" }
          ]
        });
      }
    }

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
      if (!value || typeof value !== "string" || value.trim() === "") {
        return Response.json({ error: "Search value cannot be empty" }, { status: 400 });
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
      { error: error instanceof Error ? error.message : "Graph service unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
