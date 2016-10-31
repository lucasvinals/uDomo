/**
 * Hi! I'm Lucas Viñals from Rosario, Argentina and I've been working with this proyect for a few months for my final proyect in university.
 * I've tried to write all the code in english. Sorry if any languaje mistake.
 *
 * Please, change device constants acordingly to your network (uDomoConnection) and hardware setup (uDomoActions).
 *
 * Author              : Lucas Viñals
 * Created             : 06/06/2015
 * Contact             : lucas.vinals@gmail.com
 * URL of this project : https://github.com/lucasvinals/uDomo
 */

#include "uDomoActions.h"

const short DEBOUNCE = 400;

uDomoActions Actions;

void changeB1(){
  short button = 0;
  stateOutput[button] = !stateOutput[button];
  digitalWrite(OUTPUTS[button], stateOutput[button]);
  buttonPressed = true;
  delayMicroseconds(DEBOUNCE * 1000);
}

void changeB2(){
  short button = 1;
  stateOutput[button] = !stateOutput[button];
  digitalWrite(OUTPUTS[button], stateOutput[button]);
  buttonPressed = true;
  delayMicroseconds(DEBOUNCE * 1000);
}

void setup(){
  attachInterrupt(digitalPinToInterrupt(INPUTS[0]), changeB1, HIGH);
  attachInterrupt(digitalPinToInterrupt(INPUTS[1]), changeB2, HIGH);

  Actions.setup();
}

void loop() { Actions.loop(); }
