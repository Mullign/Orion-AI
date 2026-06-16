import {
  deleteConversation,
  getConversation,
  updateConversation,
} from "@/lib/conversations/store";
import {
  requireSessionUsername,
  unauthorizedResponse,
} from "@/lib/require-session";
import type { StoredMessage } from "@/lib/conversations/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const username = await requireSessionUsername();
    const { id } = await context.params;
    const conversation = getConversation(username, id);

    if (!conversation) {
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    }

    return Response.json({ conversation });
  } catch {
    return unauthorizedResponse();
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const username = await requireSessionUsername();
    const { id } = await context.params;
    const body = (await req.json()) as {
      messages?: StoredMessage[];
      provider?: string;
      model?: string;
      customModel?: string;
      title?: string;
    };

    if (!body.messages) {
      return Response.json({ error: "Messages are required." }, { status: 400 });
    }

    const conversation = updateConversation(username, id, {
      messages: body.messages,
      provider: body.provider,
      model: body.model,
      customModel: body.customModel,
      title: body.title,
    });

    if (!conversation) {
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    }

    return Response.json({ conversation });
  } catch {
    return unauthorizedResponse();
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const username = await requireSessionUsername();
    const { id } = await context.params;
    const deleted = deleteConversation(username, id);

    if (!deleted) {
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch {
    return unauthorizedResponse();
  }
}
