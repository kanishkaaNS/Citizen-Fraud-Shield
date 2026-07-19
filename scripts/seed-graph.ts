import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { runWrite, closeDriver } from "../lib/neo4j";

async function seed() {
  const cypher = `
    // Scammers
    MERGE (s1:Scammer {id: 'scammer_a'}) ON CREATE SET s1.label = 'Alias: John', s1.phone_count = 2
    MERGE (s2:Scammer {id: 'scammer_b'}) ON CREATE SET s2.label = 'Alias: Mike', s2.phone_count = 1
    MERGE (s3:Scammer {id: 'scammer_c'}) ON CREATE SET s3.label = 'Alias: Dave', s3.phone_count = 1
    MERGE (s4:Scammer {id: 'scammer_d'}) ON CREATE SET s4.label = 'Alias: Sam', s4.phone_count = 1

    // Victims
    MERGE (v1:Victim {id: 'victim_1'}) ON CREATE SET v1.label = 'Victim-014'
    MERGE (v2:Victim {id: 'victim_2'}) ON CREATE SET v2.label = 'Victim-015'
    MERGE (v3:Victim {id: 'victim_3'}) ON CREATE SET v3.label = 'Victim-016'
    MERGE (v4:Victim {id: 'victim_4'}) ON CREATE SET v4.label = 'Victim-017'
    MERGE (v5:Victim {id: 'victim_5'}) ON CREATE SET v5.label = 'Victim-018'
    MERGE (v6:Victim {id: 'victim_6'}) ON CREATE SET v6.label = 'Victim-019'

    // MuleAccounts
    MERGE (m1:MuleAccount {id: 'mule_1'}) ON CREATE SET m1.label = 'XXXX-4471', m1.bank = 'Bank A'
    MERGE (m2:MuleAccount {id: 'mule_2'}) ON CREATE SET m2.label = 'XXXX-1234', m2.bank = 'Bank B'
    MERGE (m3:MuleAccount {id: 'mule_3'}) ON CREATE SET m3.label = 'XXXX-5678', m3.bank = 'Bank C'
    MERGE (m4:MuleAccount {id: 'mule_4'}) ON CREATE SET m4.label = 'XXXX-9999', m4.bank = 'Bank D'

    // PhoneNumbers
    MERGE (p1:PhoneNumber {id: 'phone_1'}) ON CREATE SET p1.label = '+91-XXXXX-891'
    MERGE (p2:PhoneNumber {id: 'phone_2'}) ON CREATE SET p2.label = '+91-XXXXX-892'
    MERGE (p3:PhoneNumber {id: 'phone_3'}) ON CREATE SET p3.label = '+91-XXXXX-893'
    MERGE (p4:PhoneNumber {id: 'phone_4'}) ON CREATE SET p4.label = '+91-XXXXX-894'
    MERGE (p5:PhoneNumber {id: 'phone_5'}) ON CREATE SET p5.label = '+91-XXXXX-895'

    // Shared PhoneNumber (Scammer-A and Scammer-B)
    MERGE (s1)-[:LINKED_TO]->(p1)
    MERGE (s2)-[:LINKED_TO]->(p1)
    MERGE (s1)-[:LINKED_TO]->(p2)
    MERGE (s3)-[:LINKED_TO]->(p3)
    MERGE (s4)-[:LINKED_TO]->(p4)
    MERGE (s4)-[:LINKED_TO]->(p5)

    // Shared MuleAccount (Scammer-A and Scammer-C)
    MERGE (s1)-[:LINKED_TO]->(m1)
    MERGE (s3)-[:LINKED_TO]->(m1)
    MERGE (s2)-[:LINKED_TO]->(m2)
    MERGE (s4)-[:LINKED_TO]->(m3)
    MERGE (s4)-[:LINKED_TO]->(m4)

    // Victims -> REPORTED -> Scammer (Every Victim has exactly one REPORTED edge)
    MERGE (v1)-[:REPORTED {report_id: 'R1', risk_score: 95, timestamp: '2023-10-01'}]->(s1)
    MERGE (v2)-[:REPORTED {report_id: 'R2', risk_score: 85, timestamp: '2023-10-02'}]->(s2)
    MERGE (v3)-[:REPORTED {report_id: 'R3', risk_score: 90, timestamp: '2023-10-03'}]->(s1)
    MERGE (v4)-[:REPORTED {report_id: 'R4', risk_score: 80, timestamp: '2023-10-04'}]->(s3)
    MERGE (v5)-[:REPORTED {report_id: 'R5', risk_score: 99, timestamp: '2023-10-05'}]->(s4)
    MERGE (v6)-[:REPORTED {report_id: 'R6', risk_score: 75, timestamp: '2023-10-06'}]->(s4)

    // MuleAccount -> RECEIVED_FROM -> Victim (Every MuleAccount has at least one RECEIVED_FROM edge)
    MERGE (m1)-[:RECEIVED_FROM]->(v1)
    MERGE (m1)-[:RECEIVED_FROM]->(v3)
    MERGE (m2)-[:RECEIVED_FROM]->(v2)
    MERGE (m3)-[:RECEIVED_FROM]->(v5)
    MERGE (m4)-[:RECEIVED_FROM]->(v6)
    MERGE (m1)-[:RECEIVED_FROM]->(v4)
  `;

  try {
    await runWrite(cypher);
    console.log("Graph seeded successfully");
  } catch (error) {
    console.error("Error seeding graph:", error);
  } finally {
    await closeDriver();
  }
}

seed();
