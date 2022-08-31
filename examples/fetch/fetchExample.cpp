#include <Arduino.h>
#include "LittleFS.h"

#include "WiFiManager.h"
#include "webServer.h"
#include "updater.h"
#include "fetch.h"
#include "configManager.h"
#include "timeSync.h"

struct task
{    
    unsigned long rate;
    unsigned long previous;
};

task taskA = { .rate = 5000, .previous = 0 };

void setup() 
{
    Serial.begin(115200);

    LittleFS.begin();
    GUI.begin();
    configManager.begin();
    WiFiManager.begin(configManager.data.projectName);
    timeSync.begin();
}

void loop() 
{
    //software interrupts
    WiFiManager.loop();
    updater.loop();
    configManager.loop();

    //task A
    if (taskA.previous==0 || (millis() - taskA.previous > taskA.rate ))
    {
        taskA.previous = millis();

        //do task
        Serial.println(ESP.getFreeHeap());
                
        fetch.GET("https://www.google.com");

        while (fetch.busy())
        {
            if (fetch.available())
            {
                Serial.write(fetch.read());           
            }
        }
        
        fetch.clean();
    }
}
