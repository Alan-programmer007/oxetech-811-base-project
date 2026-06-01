export class EmailService {
  sendEmail(to: string, subject: string, body: string): void {
    // Simula o envio de email
    console.log(`Enviando email para ${to} - Assunto: ${subject} - Corpo: ${body}`);
  }
}