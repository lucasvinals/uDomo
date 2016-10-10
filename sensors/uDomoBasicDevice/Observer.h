class Subject;

class Observer {
public:
    void attachSubject(Subject *subject);
    virtual void onReceivedDataFromSubject(const Subject*) = 0;
};
