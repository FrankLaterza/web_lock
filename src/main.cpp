#include "LittleFS.h"
#include "WiFiManager.h"
#include "configManager.h"
#include "dashboard.h"
#include "timeSync.h"
#include "updater.h"
#include "webServer.h"
#include <Arduino.h>
#include <structArr.h>

#define PASSWORD 74269
#define DOOR_DELAY_OPEN 2000
#define DOOR_DELAY_HOME 1300
#define LED D4
#define MOTOR_PIN_1 D5
#define MOTOR_PIN_2 D6

struct task
{
    unsigned long rate;
    unsigned long previous;
};

// updates data
task taskA = {.rate = 500, .previous = 0};

// login timeout
task taskB = {.rate = 120000, .previous = 0};

task taskC = {.rate = 3000, .previous = 0};

// data for user struct
UsersStruct users[SIZE];
char uuid[37];
char date[11];

// create an array of 30 login spots

// bool checkLogin(loginArr login, char uuid[36], char lastDate[13]){

// }

// function to lock the door
void lockDoor()
{
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

// function to unlock the door
void unlockDoor()
{
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

// toggles the lock state
void checkLock()
{
    // if lock is toggled
    if (dash.data.Lock)
    {
        dash.data.Lock = false;
        dash.data.isLocked = true;
        lockDoor();
    }
    // if unlock is toggled
    if (dash.data.Unlock)
    {
        dash.data.Unlock = false;
        dash.data.isLocked = false;
        unlockDoor();
    }
}

/*
 * checks if the current password is true.

 * if password accepted then it will set the
 * acceptance to true. This is needed for the
 * door lock page to load. this will reset
 * in a defined period of time.
 *
 * if not the accpentace will be false and the
 * lock page won't load. this also counts fails
*/
void checkPassword()
{

    // if there is no id then don't check pw
    if(strcmp(dash.data.browserId, "0") == 0){
        return;
    }
    // see if the users is already logged in (update time if found)
    if (savedUsers.exists(users, dash.data.browserId, dash.data.date))
    {
        dash.data.passwordAcceptance = true;
        // its been read so resets
        strcpy(dash.data.browserId, "0");
        strcpy(dash.data.date, "0");
        savedUsers.printUsers(users);
        Serial.println("USER FOUND!");
        // dash.data.date = '0';
    }

    // if the password maches
    else if (dash.data.passwordInput == PASSWORD)
    {
        // set the acceptance to true
        dash.data.passwordAcceptance = true;
        // reset fail count
        // dash.data.passwordFail = 0;

        // add uers
        savedUsers.addUser(users, dash.data.browserId, dash.data.date);
        // its been read so reset
        strcpy(dash.data.browserId, "0");
        strcpy(dash.data.date, "0");
        Serial.println("USER ADDED");
        savedUsers.printUsers(users);

        // if pasword failed
    }
    else if (dash.data.passwordInput != 0)
    {
        // set the api to unaccepted password
        dash.data.passwordAcceptance = false;
        // add one to the fail count
        // dash.data.passwordFail++;
    }
}

void resetAcceptance()
{
    dash.data.passwordAcceptance = false;
    lockDoor();
    Serial.println("password reset");
    // ESP.restart();
}

// setup
void setup()
{
    // setup serail
    Serial.begin(115200);
    // pin setup
    pinMode(LED, OUTPUT);
    pinMode(MOTOR_PIN_1, OUTPUT);
    pinMode(MOTOR_PIN_2, OUTPUT);

    // start all the librarys
    LittleFS.begin();
    GUI.begin();
    configManager.begin();
    WiFiManager.begin(configManager.data.projectName);
    timeSync.begin();
    dash.begin(1000);
    savedUsers.init(users);

    // the door should start locked
    dash.data.isLocked = false;
}

void loop()
{

    // software interrupts
    WiFiManager.loop();
    updater.loop();
    configManager.loop();
    dash.loop();

    // task A
    if (taskA.previous == 0 || (millis() - taskA.previous > taskA.rate))
    {
        // get last millis
        taskA.previous = millis();
        // check the password
        checkPassword();
        // reset the password after check
        dash.data.passwordInput = 0;
    }

    // starts acceptance time window
    if (dash.data.passwordAcceptance)
    {
        // start the timer
        if (millis() - taskB.previous > taskB.rate)
        {
            taskB.previous = millis();
            resetAcceptance();
        }
        // record the last time
    }
    else
    {
        taskB.previous = millis();
    }

    // check the lock state toggle.
    checkLock();
}
