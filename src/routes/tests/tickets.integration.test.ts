import { describe, test, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import { createApp } from "../../app";
import { Ticket } from "../../core/Ticket";
import type { CommentRepository } from "../../core/repositories/CommentRepository";
import type { TicketRepository } from "../../core/repositories/TicketRepository";
import type { UserRepository } from "../../core/repositories/UserRepository";
import type { Mailer } from "../../services/email/EmailService";
import type { TicketComment, User } from "../../types/types";

// Repositorios em memoria: os testes de integracao nao precisam de banco real.
// Injetamos implementacoes fake pela mesma interface usada em producao (Prisma).
class InMemoryUserRepository implements UserRepository {
  constructor(private readonly users: User[]) {}
  async findAll(): Promise<User[]> {
    return this.users;
  }
  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }
}

class InMemoryTicketRepository implements TicketRepository {
  private readonly tickets: Ticket[] = [];
  async findAll(): Promise<Ticket[]> {
    return this.tickets;
  }
  async findById(id: string): Promise<Ticket | undefined> {
    return this.tickets.find((ticket) => ticket.id === id);
  }
  async add(ticket: Ticket): Promise<void> {
    this.tickets.push(ticket);
  }
  async update(): Promise<void> {
    // Tickets sao mutados em memoria; nao ha nada a persistir.
  }
}

class InMemoryCommentRepository implements CommentRepository {
  private readonly comments: TicketComment[] = [];
  async findByTicketId(ticketId: string): Promise<TicketComment[]> {
    return this.comments.filter((comment) => comment.ticketId === ticketId);
  }
  async add(comment: TicketComment): Promise<void> {
    this.comments.push(comment);
  }
}

const noopMailer: Mailer = {
  async sendEmail(): Promise<void> {
    // Nao envia nada nos testes.
  },
};

function buildApp() {
  const users: User[] = [
    {
      id: "user_ana",
      name: "Ana Beatriz",
      email: "ana.aluna@example.com",
      role: "student",
      password: "123456",
    },
  ];

  return createApp({
    userRepository: new InMemoryUserRepository(users),
    ticketRepository: new InMemoryTicketRepository(),
    commentRepository: new InMemoryCommentRepository(),
    emailService: noopMailer,
  });
}

describe("POST /api/tickets", () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => {
    app = buildApp();
  });

  test("cria um ticket com sucesso e retorna 201", async () => {
    const response = await request(app).post("/api/tickets").send({
      title: "Nao consigo acessar o portal",
      description: "Aparece erro ao tentar logar.",
      category: "sistemas",
      requesterId: "user_ana",
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      title: "Nao consigo acessar o portal",
      category: "sistemas",
      requesterId: "user_ana",
      status: "open",
    });
    // O ticket criado deve ter um id e uma prioridade calculada.
    expect(response.body.id).toBeDefined();
    expect(response.body.priority).toBeDefined();
  });

  test("retorna 400 quando faltam campos obrigatorios", async () => {
    const response = await request(app).post("/api/tickets").send({
      title: "So o titulo foi enviado",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Campos obrigatorios ausentes");
  });

  test("retorna 400 quando o solicitante (requesterId) nao existe", async () => {
    const response = await request(app).post("/api/tickets").send({
      title: "Ticket com solicitante invalido",
      description: "Esse usuario nao existe no banco.",
      category: "sistemas",
      requesterId: "user_inexistente",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Solicitante invalido");
  });
});
