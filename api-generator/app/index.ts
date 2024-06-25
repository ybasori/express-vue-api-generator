// import express from "express";

import app from "app/main";

const port = Number(process.env.PORT || 5000);

// app.use(express.static("public"));
app.listen(port, () => {
  //
  // eslint-disable-next-line no-console
  console.log(`> ready on http://localhost:${port}`);
});
