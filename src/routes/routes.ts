import { Router } from "express";
import { HealthController } from "../controllers/HealthController";
import { TicketController } from "../controllers/TicketController";
import { UserController } from "../controllers/UserController";

export interface RouterControllers {
  healthController: HealthController;
  userController: UserController;
  ticketController: TicketController;
}

export function createRouter(controllers: RouterControllers): Router {
  const { healthController, userController, ticketController } = controllers;
  const router = Router();

  router.get("/health", healthController.check);

  router.get("/users", userController.list);

  router.get("/tickets", ticketController.list);
  router.get("/tickets/summary", ticketController.summary);
  router.get("/tickets/:id", ticketController.getById);
  router.post("/tickets", ticketController.create);
  router.patch("/tickets/:id/status", ticketController.updateStatus);
  router.post("/tickets/:id/comments", ticketController.addComment);

  return router;
}

export default createRouter;
