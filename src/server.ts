import "dotenv/config";
import { app, dispatcher } from "./app";

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Oxetech Helpdesk API running on http://localhost:${port}`);
});

export { dispatcher };
