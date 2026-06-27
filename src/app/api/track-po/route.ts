import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mock data for PO Tracking simulation
const MOCK_DATA: Record<string, any> = {
  "PO-2026-001": {
    po_number: "PO-2026-001",
    client: "Urbnesian",
    product: "Kaos Polos Combed 30s",
    quantity: 500,
    current_status: "sewing",
    timeline: [
      { status: "pending", date: "2026-06-20T10:00:00Z", completed: true },
      { status: "cutting", date: "2026-06-22T14:30:00Z", completed: true },
      { status: "sewing", date: "2026-06-25T09:00:00Z", completed: true }, // Current active stage
      { status: "qc", date: null, completed: false },
      { status: "packing", date: null, completed: false },
      { status: "ready", date: null, completed: false }
    ],
    estimated_delivery: "2026-07-05T00:00:00Z"
  },
  "PO-2026-002": {
    po_number: "PO-2026-002",
    client: "LocalPride",
    product: "Jaket Coach Custom",
    quantity: 150,
    current_status: "ready",
    timeline: [
      { status: "pending", date: "2026-06-10T10:00:00Z", completed: true },
      { status: "cutting", date: "2026-06-12T14:30:00Z", completed: true },
      { status: "sewing", date: "2026-06-18T09:00:00Z", completed: true },
      { status: "qc", date: "2026-06-22T11:00:00Z", completed: true },
      { status: "packing", date: "2026-06-25T15:00:00Z", completed: true },
      { status: "ready", date: "2026-06-26T09:00:00Z", completed: true }
    ],
    estimated_delivery: "2026-06-28T00:00:00Z"
  }
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const isTest = searchParams.get("test") === "true";
  const poNumber = searchParams.get("po_number");

  try {
    // 1. Fetch settings from DB
    const settings = await prisma.settings.findMany({
      where: {
        key: { in: ["external_api_url", "external_api_key"] }
      }
    });
    
    const apiUrl = settings.find(s => s.key === "external_api_url")?.value;
    const apiKey = settings.find(s => s.key === "external_api_key")?.value;

    // 2. Handle Test Connection from Admin Dashboard
    if (isTest) {
      if (!apiUrl) {
        return NextResponse.json({ success: false, error: "API URL not configured" }, { status: 400 });
      }

      try {
        // Try to ping the external API
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
        
        // Timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Try fetching a dummy PO just to check connection
        const response = await fetch(`${apiUrl}?test_connection=1`, { 
          headers,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          return NextResponse.json({ success: true, message: "Connected to external system" });
        } else {
          // If the URL is valid but returns 404/401, we might still consider it "reachable" 
          // but for this demo let's fail it if it's not 2xx.
          return NextResponse.json({ success: false, error: `External API returned status ${response.status}` });
        }
      } catch (err: any) {
        // If fetch fails entirely (network error, CORS, etc)
        // For the sake of the DEMO: If the user inputs a fake URL, we will simulate success 
        // if they put "mock" or "dummy" in the URL.
        if (apiUrl.includes("mock") || apiUrl.includes("dummy") || apiUrl.includes("localhost")) {
           return NextResponse.json({ success: true, message: "Connected to MOCK system" });
        }
        return NextResponse.json({ success: false, error: err.message || "Connection failed" });
      }
    }

    // 3. Handle actual PO Tracking request
    if (!poNumber) {
      return NextResponse.json({ success: false, error: "Missing po_number parameter" }, { status: 400 });
    }

    // For the DEMO/MOCKUP: We will use local mock data if the PO exists in our mock data
    if (MOCK_DATA[poNumber]) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json({ success: true, data: MOCK_DATA[poNumber] });
    }

    // Real API Fetch Logic
    if (apiUrl) {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
        
        // Add PO number as query param or replace in URL if it's a REST path
        const fetchUrl = apiUrl.includes('?') 
          ? `${apiUrl}&po_number=${encodeURIComponent(poNumber)}`
          : `${apiUrl}?po_number=${encodeURIComponent(poNumber)}`;

        const response = await fetch(fetchUrl, { headers });
        
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ success: true, data });
        }
        
        if (response.status === 404) {
          return NextResponse.json({ success: false, error: "PO tidak ditemukan." }, { status: 404 });
        }
        
      } catch (err) {
        console.error("External API Error:", err);
        // Fallback to error
      }
    }

    // If no real API and not in mock data
    return NextResponse.json({ success: false, error: "Nomor PO tidak ditemukan atau sistem sedang offline." }, { status: 404 });

  } catch (error) {
    console.error("Track PO Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
