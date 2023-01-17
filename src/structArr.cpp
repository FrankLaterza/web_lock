#include "structArr.h"
#include <Arduino.h>
// #include <iostream>
// #include <stdio.h>
// #include <stdlib.h>
// #include <string.h>

// using namespace std;

// set all users to nothing CONSTRUCTOR
void SavedUsers::init(UsersStruct *users)
{
    for (int i = 0; i < SIZE; i++)
    {
        strcpy(users[i].uuid, "0");
        strcpy(users[i].lastDate, "0");
    }
}

// set all users to nothing
void SavedUsers::removeByIndex(UsersStruct *users, int index)
{
    int i;
    for (i = index; i < SIZE - 1; i++)
    {
        // break when zero
        if (strcmp(users[i].uuid, "0") == 0)
        {
            break;
        }
        // copy
        strcpy(users[i].uuid, users[i + 1].uuid);
        strcpy(users[i].lastDate, users[i + 1].lastDate);
    }
    // remove last
    strcpy(users[SIZE - 1].uuid, "0");
    strcpy(users[SIZE - 1].lastDate, "0");
    // subtrack length
    length--;
}

// prints the users (id , date)
void SavedUsers::printUsers(UsersStruct *users)
{
    Serial.print("%sPrinting Nodes ඞ%s\n");
    for (int i = 0; i < SIZE; i++)
    {
        Serial.print(i + 1);
        Serial.print(") ");
        Serial.print(users[i].uuid);
        Serial.print(", ");
        Serial.println(users[i].lastDate);
    }
    Serial.println();
}

// Convert char date string to long int
long int SavedUsers::convertDate(char *date)
{
    long int dateConverted = atoi(date);

    return dateConverted;
}

// Convert seconds into days
int SavedUsers::secondsToDays(long int seconds)
{
    int days = (int)(seconds / 86400.0);

    return days;
}

// Compares current day with stored day, if day interval is
// outside of range, delete day from list and return false,
// otherwise return true.
void SavedUsers::dateCheck(UsersStruct *user, int index, char *date)
{

    // FIX TO TAKE A DATE!!!!
    int currentDay = secondsToDays(time(NULL)); // import current date
    int lastDay = secondsToDays(convertDate(user[index].lastDate));

    // if its been two days
    if ((currentDay - lastDay) >= INTERVAL)
    {
        removeByIndex(user, index);
    }
}

void SavedUsers::checkDuups(UsersStruct *users, int index, char *uuid)
{
    if (strcmp(users[index].uuid, uuid) == 0)
    {
        removeByIndex(users, index);
        // ALSO CHANGE SET THE AUTH TO TRUE
    }
}

// check all the item
void SavedUsers::userUpdate(UsersStruct *users, char *uuid, char *date)
{

    // loop through all the dates and check them
    for (int i = 0; i < SIZE; i++)
    {
        dateCheck(users, i, date);
        // checkDuups(users, i, uuid);
    }
}

// shift all the users over
void SavedUsers::shiftUser(UsersStruct *users)
{
    int i;
    for (i = SIZE - 1; i > 0; i--)
    {
        // copy
        strcpy(users[i].uuid, users[i - 1].uuid);
        strcpy(users[i].lastDate, users[i - 1].lastDate);
    }
    // copy first
    strcpy(users[0].uuid, "0");
    strcpy(users[0].lastDate, "0");
}

// this will add a user
void SavedUsers::addUser(UsersStruct *users, char *uuid, char *date)
{

    // check that all dates are valid
    userUpdate(users, uuid, date);
    // shift everything to the right

    // if it doesn't exits then add (still update time if exits)
    if (!exists(users, uuid, date))
    {

        shiftUser(users);
        // copy to first
        strcpy(users[0].uuid, uuid);
        strcpy(users[0].lastDate, date);
        // we need to find the next position and add

        // if its not full inc
        if (length < SIZE - 1)
        {
            length++;
        }
    }
}

bool SavedUsers::exists(UsersStruct *users, char *uuid, char *date)
{

    // loop through all the dates and check them
    for (int i = 0; i < SIZE; i++)
    {
        if (strcmp(users[i].uuid, uuid) == 0)
        {
            // update the time
            strcpy(users[i].lastDate, date);
            return true;
        }
    }
    return false;
}

SavedUsers savedUsers;