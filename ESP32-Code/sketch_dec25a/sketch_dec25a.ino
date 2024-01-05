#include <WiFi.h>
#include <PubSubClient.h>

const char *ssid = "Galaxy S10+";
const char *password = "17khizar";

const char *mqtt_broker = "broker.hivemq.com";
const char *ledTopic = "led/control";
const int mqtt_port = 1883;
const int ledPin = 23;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
    Serial.begin(115200);
    pinMode(ledPin, OUTPUT);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the Wi-Fi network");

    client.setServer(mqtt_broker, mqtt_port);
    client.setCallback(callback);
    while (!client.connected()) {
        String client_id = "esp32-client-";
        client_id += String(WiFi.macAddress());
        Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());
        if (client.connect(client_id.c_str())) {
            Serial.println("Public EMQX MQTT broker connected");
            client.subscribe("led/control");
        } else {
            Serial.println("Failed connection");
            delay(2000);
        }
    }
}

void callback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);
    Serial.print("Message:");
    char message[3];
    for (int i = 0; i < length; i++) {
        message[i] = (char) payload[i];
        Serial.print((char) payload[i]);
    }
    Serial.println(length);
    Serial.printf(message);
    Serial.println();
    Serial.printf("-----------------------");
   if (strncmp(message, "on", 2) == 0) {
    digitalWrite(ledPin, HIGH);
    Serial.println("LED turned on");
} else if (strncmp(message, "off", 3) == 0) {
    digitalWrite(ledPin, LOW);
    Serial.println("LED turned off");
} else {
    digitalWrite(ledPin, HIGH);
    Serial.println("LED turned on");
}


}

void loop() {
  // digitalWrite(ledPin, HIGH);
    client.loop();
}
