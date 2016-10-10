#include "Observer.h"
#include "Subject.h"

void Observer::attachSubject(Subject * subject) {
    subject->registerObserver(this);
}