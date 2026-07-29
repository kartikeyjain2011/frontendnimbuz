import { NextResponse } from "next/server";

const ADMIN_CONSOLE_URL =
  process.env.NEXT_PUBLIC_ADMIN_CONSOLE_URL || "https://nimbus-admin-ruby.vercel.app";

// In-memory store for recent sync operations
const syncLogs: Array<{
  id: string;
  type: string;
  data: any;
  timestamp: string;
  status: string;
}> = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data, timestamp } = body;

    const logEntry = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: type || "unknown",
      data: data || {},
      timestamp: timestamp || new Date().toISOString(),
      status: "received",
    };

    // Store in-memory
    syncLogs.unshift(logEntry);
    if (syncLogs.length > 200) syncLogs.pop();

    // Forward to remote Admin Console URL: https://nimbus-admin-ruby.vercel.app
    let adminResponseStatus = 200;
    let adminResponseBody = null;

    try {
      const targetEndpoint = `${ADMIN_CONSOLE_URL}/api/sync`;
      const res = await fetch(targetEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Nimbus-Source": "nimbus-cloud-gaming-server",
        },
        body: JSON.stringify(logEntry),
      });
      adminResponseStatus = res.status;
      adminResponseBody = await res.json().catch(() => null);
      logEntry.status = res.ok ? "synced_to_admin" : "admin_responded_error";
    } catch (adminErr: any) {
      console.log("[AdminSync Proxy] Remote fetch notice (Admin console endpoint offline or static):", adminErr?.message);
      logEntry.status = "cached_locally";
    }

    return NextResponse.json({
      success: true,
      message: "Data successfully processed and queued for Admin Console",
      adminConsoleUrl: ADMIN_CONSOLE_URL,
      syncedEvent: logEntry,
      adminResponseStatus,
      adminResponseBody,
    });
  } catch (err: any) {
    console.error("[AdminSync API] Processing error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process admin sync payload" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    adminConsoleUrl: ADMIN_CONSOLE_URL,
    totalRecords: syncLogs.length,
    recentEvents: syncLogs,
  });
}
