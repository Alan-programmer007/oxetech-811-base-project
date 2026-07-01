import { TicketComment } from "../../types/types";

export interface CommentRepository {
  findByTicketId(ticketId: string): Promise<TicketComment[]>;
  add(comment: TicketComment): Promise<void>;
}
