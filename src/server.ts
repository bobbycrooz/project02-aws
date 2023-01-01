import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get(
    "/filteredimage",
    (req, res, next) => {
      // authentication
      // const authorization = req.headers.authorization.split(" ");

      // const token = authorization[1];

      // if (!token) {
      //   res.status(401).send("not authorized").end();
      // }

      next();
    },
    async (req, res) => {
      const { image_url } = req.query;

      if (!image_url) return res.send("no image url provided").end();

      try {
        let filteredImagePath = await filterImageFromURL(image_url);
        if (filteredImagePath) {
          res.sendFile(filteredImagePath);
          deleteLocalFiles([filteredImagePath]);
        }

        return;
      } catch (error) {
        res.status(401).send({ error: error });
      }
    }
  );

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
