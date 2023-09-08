import { NextResponse } from "next/server";
import { z } from "zod";
import { tb } from "./client";

export const getTopSearches = tb.buildPipe({
  pipe: "top_10_searched_products",
  // parameters: z.object({
  //   product_id: z.string().optional(),
  // }),
  data: z.object({
    product_id: z.string(),
    total: z.number(),
  }),
});

// http://localhost:3000/api/tinybird
export const GET = async (request: Request) => {
  const res = await getTopSearches({
    // product_id: "1",
  });

  return NextResponse.json(res.data);
};
