import prisma from "../../lib/prisma.js";

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toDescriptionSnippet(html: string): string {
  const text = stripHtml(html);
  if (!text) return "";
  if (
    /@media/i.test(text) ||
    (text.match(/\{/g)?.length ?? 0) > 2 ||
    /^\s*\.[a-z0-9_-]+\s*\{/i.test(text)
  ) {
    return "";
  }
  return text.slice(0, 140);
}

function parseTicketNumberQuery(q: string): number | null {
  const match = /^#?(\d+)$/.exec(q.trim());
  if (!match) return null;
  return parseInt(match[1], 10);
}

export async function searchTickets(
  workspaceId: string,
  q: string,
  limit: number,
) {
  const ticketNumber = parseTicketNumberQuery(q);
  const text = q.trim();

  const orConditions: object[] = [
    { subject: { contains: text, mode: "insensitive" as const } },
    { description: { contains: text, mode: "insensitive" as const } },
  ];

  if (ticketNumber !== null) {
    orConditions.push({ ticketNumber });
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      workspaceId,
      OR: orConditions,
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      ticketNumber: true,
      subject: true,
      description: true,
      status: true,
      priority: true,
      updatedAt: true,
      customer: { select: { name: true, email: true } },
      assignee: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  return tickets.map((ticket) => ({
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    subject: ticket.subject,
    descriptionSnippet: toDescriptionSnippet(ticket.description),
    status: ticket.status,
    priority: ticket.priority,
    updatedAt: ticket.updatedAt.toISOString(),
    customer: ticket.customer,
    assignee: ticket.assignee,
  }));
}
