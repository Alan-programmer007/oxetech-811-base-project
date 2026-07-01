import { CommentRepository } from "../../core/repositories/CommentRepository";
import { TicketComment } from "../../types/types";
import { prisma } from "./prisma";

export class PrismaCommentRepository implements CommentRepository {
  async findByTicketId(ticketId: string): Promise<TicketComment[]> {
    const rows = await prisma.ticketComment.findMany({ where: { ticketId } });
    return rows.map((row) => ({
      id: row.id,
      ticketId: row.ticketId,
      authorId: row.authorId,
      message: row.message,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async add(comment: TicketComment): Promise<void> {
    await prisma.ticketComment.create({
      data: {
        id: comment.id,
        ticketId: comment.ticketId,
        authorId: comment.authorId,
        message: comment.message,
        createdAt: comment.createdAt,
      },
    });
  }
}
