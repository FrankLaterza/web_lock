#include "LittleFS.h"
#include "WiFiManager.h"
#include "configManager.h"
#include "dashboard.h"
#include "timeSync.h"
#include "updater.h"
#include "webServer.h"
#include <Arduino.h>
#include <Vector.h>

#define PASSWORD 74269
#define DOOR_DELAY_OPEN 2000
#define DOOR_DELAY_HOME 1300
#define LED D4
#define MOTOR_PIN_1 D5
#define MOTOR_PIN_2 D6

struct task {
    unsigned long rate;
    unsigned long previous;
};

// updates data
task taskA = { .rate = 500, .previous = 0 };

// login timeout
task taskB = { .rate = 120000, .previous = 0 };

task taskC = { .rate = 3000, .previous = 0 };

typedef struct loginArr {
    int val;
    // char uuid[36];
    // char lastDate[13];
} loginArr_t;

// create an array of 30 login spots

// bool checkLogin(loginArr login, char uuid[36], char lastDate[13]){
//     strcmp (uuid, login[0].uuid);

// }

void lockDoor() {
    digitalWrite(LED, LOW);
    digitalWrite(MOTOR_PIN_1, HIGH);
    digitalWrite(MOTOR_PIN_2, LOW);
    delay(DOOR_DELAY_OPEN);
    digitalWrite(MOTOR_PIN_1, LOW);
    digitalWrite(MOTOR_PIN_2, HIGH);
    delay(DOOR_DELAY_HOME);
    digitalWrite(LED, LOW);
    digitalWrite(MOTOR_PIN_1, LOW);
    digitalWrite(MOTOR_PIN_2, LOW);
}

void unlockDoor() {
    digitalWrite(LED, HIGH);
    digitalWrite(MOTOR_PIN_1, LOW);
    digitalWrite(MOTOR_PIN_2, HIGH);
    delay(DOOR_DELAY_OPEN);
    digitalWrite(MOTOR_PIN_1, HIGH);
    digitalWrite(MOTOR_PIN_2, LOW);
    // FRANK U ARE A GAY MAN THIS IS FROM UR COMPUTER
    delay(DOOR_DELAY_HOME);
    digitalWrite(MOTOR_PIN_1, LOW);
    digitalWrite(MOTOR_PIN_2, LOW);
}

void setup() {
    Serial.begin(115200);
    pinMode(LED, OUTPUT);
    pinMode(MOTOR_PIN_1, OUTPUT);
    pinMode(MOTOR_PIN_2, OUTPUT);

    LittleFS.begin();
    GUI.begin();
    configManager.begin();
    WiFiManager.begin(configManager.data.projectName);
    timeSync.begin();
    dash.begin(1000);

    dash.data.isLocked = true;
}

void loop() {

    // software interrupts
    WiFiManager.loop();
    updater.loop();
    configManager.loop();
    dash.loop();

    // task A
    if (taskA.previous == 0 || (millis() - taskA.previous > taskA.rate)) {
        // get last millis
        taskA.previous = millis();

        if (dash.data.passwordInput != 0) {
            if (dash.data.passwordInput == PASSWORD) {
                
                dash.data.passwordAcceptance = true;
                dash.data.passwordFail = 0;
                // unlock the door
                dash.data.Unlock = false;
                dash.data.isLocked = false;
                unlockDoor();
            } else {
                dash.data.passwordAcceptance = false;
                dash.data.passwordFail++;
            }
            dash.data.passwordInput = 0;
        }
        // if lock button is pressed

        // if password is accepted
        if (dash.data.passwordAcceptance) {

            // if lock is toggled
            if (dash.data.Lock) {
                dash.data.Lock = false;
                dash.data.isLocked = true;
                lockDoor();
            }

            // if unlock is toggled
            if (dash.data.Unlock) {
                dash.data.Unlock = false;
                dash.data.isLocked = false;
                unlockDoor();
            }
        }
    }

    if (dash.data.passwordAcceptance) {
        if (millis() - taskB.previous > taskB.rate) {
            taskB.previous = millis();
            dash.data.passwordAcceptance = false;
            lockDoor();
            dash.data.isLocked = true;
            dash.data.passwordInput = 0;
            Serial.println("password reset");
            // ESP.restart();
        }
    } else {
        taskB.previous = millis();
    }

    // if (millis() - taskC.previous > taskC.rate) {
    //     taskC.previous = millis();
    //     Serial.print("heap: ");
    //     Serial.println(ESP.getFreeHeap(),DEC);
    // }
}
