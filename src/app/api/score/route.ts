import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { systemPrompt, userPrompt } from "@/lib/prompt";
import { fetchHistoricalClose } from "@/lib/prices";

const bodySchema = z.object({
  ticker: z.string().min(1),
  asOf: z.string().min(10), // YYYY-MM-DD
  question: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const { ticker, asOf, question } = bodySchema.parse(await req.json());
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");
    const oa = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-5.1";
    const enforceDefaultTemp = model?.startsWith("gpt-5");
    const historical = await fetchHistoricalClose(ticker, asOf);

    const completion = await oa.chat.completions.create({
      model,
      ...(enforceDefaultTemp ? {} : { temperature: 0.2 }),
      messages: [
        { role: "system", content: systemPrompt(asOf) },
        { role: "user", content: userPrompt({ ticker, asOf, question }) }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "scoring_bundle",
          strict: false,
          schema: {
            type: "object",
            properties: {
              result_json: { type: "object" },
              report_md: { type: "string" }
            },
            required: ["result_json", "report_md"],
            additionalProperties: true
          }
        }
      }
    });

    const text = completion.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from model");
    const payload = JSON.parse(text);
    if (historical) {
      payload.result_json = payload.result_json || {};
      payload.result_json.targets = payload.result_json.targets || {};
      payload.result_json.targets.current = {
        price: Number(historical.close.toFixed(2)),
        rationale: `歷史收盤價（${historical.date}，資料來源：Stooq）`
      };
    }
    return NextResponse.json(payload);
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 400 });
  }
}
