#include "Observer.h"
class ObserverTester : public Observer
{
    void onReceivedDataFromSubject(const Subject*) override;
};