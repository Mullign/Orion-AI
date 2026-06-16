import {
  createConversation,
  listConversations,
} from "@/lib/conversations/store";
import {
  requireSessionUsername,
  unauthorizedResponse,
} from "@/lib/require-session";

export async function GET() {
  try {
    const username = await requireSessionUsername();
    return Response.json({ conversations: listConversations(username) });
  } catch {
    return unauthorizedResponse();
  }
}

export async function POST(req: Request) {
  try {
    const username = await requireSessionUsername();
    const body = (await req.json().catch(() => ({}))) as {
      provider?: string;
      model?: string;
      customModel?: string;
    };

    const conversation = createConversation(username, body);
    return Response.json({ conversation });
  } catch {
    return unauthorizedResponse();
  }
}
