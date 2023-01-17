#ifndef STRUCTARR_H
#define STRUCTARR_H

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#define SIZE 10
#define INTERVAL 2

typedef struct node
{

    char uuid[37];
    char lastDate[11];

} UsersStruct;

class SavedUsers
{
private:
    // keeps track of length
    int length = 0;

    // Convert char date string to long int
    long int convertDate(char *date);

    // Convert seconds into days
    int secondsToDays(long int seconds);

    // Compares current day with stored day, if day interval is
    // outside of range, delete day from list and return false,
    // otherwise return true.
    void dateCheck(UsersStruct *user, int index, char *date);

    // checks for duplicates
    void checkDuups(UsersStruct *users, int index, char *uuid);

    // check all the item
    void userUpdate(UsersStruct *users, char *uuid, char *date);

    // shift all the users over
    void shiftUser(UsersStruct *users);
    // this will add a user
public:
    // set all users to nothing
    void init(UsersStruct *users);

    // prints the users (id , date)
    void printUsers(UsersStruct *users);

    // main logic for adding users
    void addUser(UsersStruct *users, char *uuid, char *date);

    // set all users to nothing
    void removeByIndex(UsersStruct *users, int index);

    // checks if the usrs is in the databse and updates time
    bool exists(UsersStruct *users, char* uuid, char* date);
};

extern SavedUsers savedUsers;

#endif