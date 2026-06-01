import cors from "cors";
import express from "express";
import "dotenv/config";
import router from "./routes/routes";
import EventEmitter from "events";
import { EmailService } from "./services/email/EmailService";

const dispatcher = new EventEmitter();
const emailService = new EmailService();

dispatcher.on("ticket.created", (ticket) => {
  emailService.sendEmail("admin@oxetech.com", "Novo Ticket Criado", `Um novo ticket foi criado: ${ticket.title}`);
});

dispatcher.on("ticket.created", (ticket) => {
  console.info(`Evento recebido: ticket.created - ${ticket.title}`);
});

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.use((_request, response) => {
  response.status(404).json({ message: "Rota nao encontrada" });
});

app.listen(port, () => {
  console.log(`Oxetech Helpdesk API running on http://localhost:${port}`);
});

export { dispatcher };