require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

let images = []; // Initialize the images array
const animals = ["cat", "dog", "fish", "tiger", "monkey", "elephant", "cow"];

function getRandomAnimal() {
  const randomIndex = Math.floor(Math.random() * animals.length);
  return animals[randomIndex];
}

function getNextImageNumber() {
  const filePath = 'images.json';

  try {
    if (fs.existsSync(filePath)) {
      const existingContent = fs.readFileSync(filePath);
      if (existingContent.length > 0) {
        const existingData = JSON.parse(existingContent);
        if (existingData.length > 0) {
          const lastImage = existingData[existingData.length - 1];
          return lastImage.number + 1;
        }
      }
    }
  } catch (error) {
    console.error("Error occurred while reading images.json:", error);
  }

  return 1; // Start from 1 if no images or images.json file exist
}

async function createImage() {
  try {
    const randomAnimal = getRandomAnimal();
    console.log("Your random animal is: ", randomAnimal);
    console.log("Creating image... ");
    const response = await openai.createImage({
      prompt: `A wet on wet oil painting of a flying ${randomAnimal} by Bob Ross.`,
      n: 1,
      size: "512x512"
    });
    const image_url = response.data.data[0].url;
    const timestamp = new Date().toLocaleTimeString();
    const imageObj = {
      number: getNextImageNumber(), // Increment the image number
      url: image_url,
      timestamp: timestamp
    };
    images.push(imageObj);
    console.log("URL to the latest image:", image_url);
  } catch (error) {
    console.error("Error occurred while fetching image:", error);
  }
}

async function writeImagesToFile(images) {
  const filePath = 'images.json';

  try {
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const existingContent = fs.readFileSync(filePath);
      if (existingContent.length > 0) {
        existingData = JSON.parse(existingContent);
      }
      else {
        existingData = []
      }
    }

    const newData = existingData.concat(images);

    const data = JSON.stringify(newData, null, 2);
    fs.writeFileSync(filePath, data);
    console.log("Images array appended to file:", filePath);
  } catch (error) {
    console.error("Error occurred while writing images to file:", error);
  }
}

async function downloadImages() {
  const folderPath = 'public/images';
  const existingFiles = fs.readdirSync(folderPath);
  const existingFileCount = existingFiles.length;

  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i].url;
    const fileName = `image_${existingFileCount + i + 1}.jpg`; // Generate a unique file name for each image
    const filePath = path.join(folderPath, fileName);

    try {
      const response = await axios.get(imageUrl, {
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      console.log(`Image ${i + 1} downloaded successfully.`);
    } catch (error) {
      console.error(`Error downloading image ${i + 1}: ${error.message}`);
    }
  }
}

async function start() {
  await createImage();
  await writeImagesToFile(images);
  await downloadImages();
}

start();