
import express from 'express';
import mqtt from 'mqtt';
import path from 'path';
import cors from 'cors';
import {fileURLToPath} from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
const app = express();
const port = 3050;

// MQTT broker configuration
const mqttBroker = 'mqtt://broker.hivemq.com'; // Use your MQTT broker URL
const ledTopic = 'led/control';

// Connect to the MQTT broker
const mqttClient = mqtt.connect(mqttBroker);
mqttClient.on("connect", ()=>{
    let recentState = JSON.parse(fs.readFileSync(path.join(__dirname, "./states.json"), 'utf8'));
    console.log("Recent State of led: ", recentState.led)
    mqttClient.publish(ledTopic, recentState.led);
    console.log("Client subscribed sucessfully!");
})

 
app.use(cors())
app.use(express.static(path.join(__dirname, './public')));

// Serve the HTML file with a button to control the LED
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// console.log(path.join(__dirname, 'index.html'))

app.get("/recent-state", (req, res)=>{
    let recentState = JSON.parse(fs.readFileSync(path.join(__dirname, "./states.json"), 'utf8'));
    // console.log("recent-state: ", recentState)
    res.json({msg: `LED turned ${recentState.led}`, isOn: recentState.led === 'on' ? 1 : 0 })
})

// Toggle the LED state and publish the message to MQTT

app.post('/toggle', (req, res) => {
  const message = req.query.state === 'on' ? 'on' : 'off';
  
  mqttClient.publish(ledTopic, message);
  jsonReader(message);
  res.json({msg: `LED turned ${message}`, isOn: req.query.state === 'on' ? 1 : 0 });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Handle MQTT connection events
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

mqttClient.on('error', (err) => {
  console.error('MQTT error:', err);
});

// Handle process termination to close the MQTT connection
process.on('SIGINT', () => {
  console.log('Closing MQTT connection');
  mqttClient.end();
  process.exit();
});

function jsonReader(msg){
    let fileData = fs.readFileSync(path.join(__dirname, "./states.json"), 'utf8');
    //console.log("fileData: ", fileData);
    let jsonWriteFile = {
        ...JSON.parse(fileData),
        led: msg 
    }
    fs.writeFileSync(path.join(__dirname, "states.json"), JSON.stringify(jsonWriteFile, null, 2))
}

// jsonReader()

// , (err, data) => {
//     if (err) {
//       console.error('Error reading the file:', err);
//       return;
//     }

//     // Step 2: Modify the content as needed
//     const jsonData = JSON.parse(data);
//     jsonData.someKey = 'newValue';
//     // Step 3: Write the modified content back to the file
//     // fs.writeFile(path.join(__dirname, "states.json"), JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
//     //   if (err) {
//     //     console.error('Error writing to the file:', err);
//     //   } else {
//     //     console.log('File updated successfully.');
//     //   }
//     // });
//  });