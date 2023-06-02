import { NextResponse } from "next/server";
const Valorant = require("@liamcottle/valorant.js");

export async function POST(request: Request) {
  const req = await request.json();
  const valorantApi = new Valorant.API(Valorant.Regions.AsiaPacific);
  valorantApi.user_agent =
    "RiotClient/65.0.7.5116254.749 rso-auth (Windows;10;;Professional, x64)";
  valorantApi.client_version = "release-06.10-shipping-9-885592";

  await valorantApi.authorize(req.username, req.password);
  const data = await valorantApi.getPlayerStoreFront(valorantApi.user_id);

  return NextResponse.json({ data: data.data });
}
