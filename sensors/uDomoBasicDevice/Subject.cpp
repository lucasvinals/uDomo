#include "Subject.h"
#include "Observer.h"

Subject::Subject() {
}

void Subject::registerObserver(Observer* obs) {
    mObserver = obs; //we will only allow one observer
}

void Subject::unregisterObserver() {
    mObserver = nullptr;
}

int Subject::getValue() const {
    return mValue;
}

void Subject::_notifyObserver() {
    if (mObserver != nullptr) {
        mObserver->onReceivedDataFromSubject(this); 
    }
}

void Subject::setVal(const int val) {
    mValue = val;
    _notifyObserver(); //since there is a change in value, notify the observer
}