import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  const ImageController = async (req: Request, res: Response) => {
    const { image_url } = req.query;

    if (!image_url) return res.send("no image url provided").end();

    try {
      let filteredImagePath: string = await filterImageFromURL(image_url);

      console.log(filteredImagePath);

      res.sendFile(filteredImagePath);

      // files to be deleted from Server after 30s of sending the file
      setTimeout(() => {
        deleteLocalFiles([filteredImagePath]);
      }, 2000);

      // return deleteLocalFiles([filteredImagePath]);
    } catch (error) {
      res.status(401).send({ error: error });
    }
  };

  const ImageFilterMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    next();
  };

  app.get("/filteredimage", ImageFilterMiddleware, ImageController);

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
