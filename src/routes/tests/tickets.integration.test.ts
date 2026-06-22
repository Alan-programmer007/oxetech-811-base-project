import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, test, expect, beforeAll } from "@jest/globals";

// 1) Banco de teste isolado:
// Apontamos a variavel DATA_FILE para um arquivo temporario ANTES de importar o app.
// Assim os testes nunca alteram o banco real (data/db.json).
const testDbPath = path.join(os.tmpdir(), "oxetech-tickets-test.json");
process.env.DATA_FILE = testDbPath;

// Dados iniciais (fixture) usados pelos testes.
const fixture = {
  users: [
    {
      id: "user_ana",
      name: "Ana Beatriz",
      email: "ana.aluna@example.com",
      role: "student",
      password: "123456",
    },
  ],
  tickets: [],
  comments: [],
};

// 2) Importamos o app DEPOIS de definir DATA_FILE.
// O supertest sobe o app em memoria, sem precisar de "app.listen".
import request from "supertest";
import { app } from "../../app";

beforeAll(() => {
  // Garante que o banco de teste comeca com os dados do fixture.
  fs.writeFileSync(testDbPath, JSON.stringify(fixture, null, 2));
});

describe("POST /api/tickets", () => {
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
