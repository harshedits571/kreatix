export async function POST(request) {
  return Response.json({ success: true, status: "synced" }, { status: 200 });
}

export async function GET(request) {
  return Response.json({ success: true, status: "online" }, { status: 200 });
}
