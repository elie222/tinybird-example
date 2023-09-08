import { NextResponse } from "next/server";
import { z } from "zod";
import { tb } from "../client";

export const publishEvent = tb.buildIngestEndpoint({
  datasource: "shopping_data",
  event: z.object({
    date: z.date(),
    product_id: z.string(),
    user_id: z.number().int().positive(),
    event: z.string(),
    extra_data: z.string().optional().default(""),
  }),
});

// http://localhost:3000/api/tinybird/publish
export const GET = async (request: Request) => {
  const res = await publishEvent({
    date: new Date(),
    product_id: "test_product",
    user_id: 1,
    event: "test",
    extra_data: JSON.stringify({ city: "Test" }),
  });

  return NextResponse.json(res);
};
