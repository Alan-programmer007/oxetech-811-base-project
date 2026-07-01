import EventEmitter from "events";
import cors from "cors";
import express, { type Express } from "express";
import { HealthController } from "./controllers/HealthController";
import { TicketController } from "./controllers/TicketController";
import { UserController } from "./controllers/UserController";
import type { CommentRepository } from "./core/repositories/CommentRepository";
import type { TicketRepository } from "./core/repositories/TicketRepository";
import type { UserRepository } from "./core/repositories/UserRepository";
import { createRouter } from "./routes/routes";
import type { Mailer } from "./services/email/EmailService";

export interface AppDependencies {
  userRepository: UserRepository;
  ticketRepository: TicketRepository;
  commentRepository: CommentRepository;
  emailService: Mailer;
}

export function createApp(deps: AppDependencies): Express {
  const dispatcher = new EventEmitter();

  dispatcher.on("ticket.created", (ticket) => {
    deps.emailService
      .sendEmail("admin@oxetech.com", "Novo Ticket Criado", `Um novo ticket foi criado: ${ticket.title}`)
      .catch((error) => console.error("Falha ao enviar email:", error));
  });

  dispatcher.on("ticket.created", (ticket) => {
    console.info(`Evento recebido: ticket.created - ${ticket.title}`);
  });

  const healthController = new HealthController();
  const userController = new UserController(deps.userRepository);
  const ticketController = new TicketController(
    deps.ticketRepository,
    deps.userRepository,
    deps.commentRepository,
    dispatcher,
  );

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/api", createRouter({ healthController, userController, ticketController }));

  app.use((_request, response) => {
    response.status(404).json({ message: "Rota nao encontrada" });
  });

  return app;
}
