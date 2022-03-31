#include <Windows.h>
#include<iostream>
using namespace std;


struct Point
{
	int x;
	int y;
};
int main()
{
	//updates speed parameters of mouse. 10 is default, 20 is highest
	SystemParametersInfo(
		SPI_SETMOUSESPEED,
		0,
		(LPVOID)20,
		SPIF_UPDATEINIFILE | SPIF_SENDCHANGE | SPIF_SENDWININICHANGE
	);

	while (true)
	{
		Sleep(3000);  //sleeps for three seconds
		mouse_event(0x0002, 314, 422, 100, 100);  // left clicks on the screen
		SetCursorPos(1211, 600); //set cursor position
		Sleep(1000);//sleeps for 1 second so cursor can move
		SetCursorPos(46, 427); //set cursor position
		mouse_event(0x0004, 314, 422, 100, 100);  //left click up
	}
	return 0;
}