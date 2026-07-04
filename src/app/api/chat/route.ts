import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { systemPrompt } from "@/lib/system-prompt";

const mimo = createOpenAI({
  baseURL: "https://api.xiaomimimo.com/v1",
  apiKey: process.env.MIMO_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: mimo("mimo-v2.5-pro"),
    system: systemPrompt,
    messages,
    maxOutputTokens: 16384,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
