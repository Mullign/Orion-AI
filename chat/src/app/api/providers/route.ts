import { getConfiguredProviders } from "@/lib/ai/providers-config";

export async function GET() {
  return Response.json({
    providers: getConfiguredProviders(),
  });
}
