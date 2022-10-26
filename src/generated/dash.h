#ifndef DASH_H
#define DASH_H

struct dashboardData
{
	char date[13];
	char browserId[36];
	bool passwordAcceptance;
	uint32_t passwordFail;
	bool isLocked;
	uint32_t passwordInput;
	bool Lock;
	bool Unlock;
};

#endif