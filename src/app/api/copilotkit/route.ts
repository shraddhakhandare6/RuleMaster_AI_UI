import { CopilotRuntime } from "@copilotkit/runtime";
import { GoogleGenerativeAIAdapter } from "@copilotkit/runtime";

export async function POST(req: Request): Promise<Response> {
  const copilotRuntime = new CopilotRuntime({});
  const result = await copilotRuntime.response(req, new GoogleGenerativeAIAdapter({}));
  return result;
}
