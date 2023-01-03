import fs from "fs";
import Jimp = require("jimp");

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);

      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale(); // set greyscale

      photo.write(__dirname + outpath, (img) => {
        // files were beign sent befere they were been created on the serve so I added a timeout to wait for the file to be created

        setTimeout(() => {
          resolve(__dirname + outpath);
        }, 2000);
      });

      // if (__dirname + outpath) console.log("outpathhas done its job");
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
