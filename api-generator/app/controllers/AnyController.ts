import { RequestHandler } from "express";

const AnyController: RequestHandler = (_req, res) => {
  return res.send(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <div id="app"></div>
      <script src="/assets/js/app.bundle.js"></script>
      <script src="/assets/js/runtime.bundle.js"></script>
    </body>
  </html>
  `);
};

export default AnyController;
