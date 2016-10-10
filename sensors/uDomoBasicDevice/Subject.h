class Observer;

class Subject {
public:
    Subject();
    void registerObserver(Observer*); 
    void unregisterObserver();
    int getValue() const;
    void setVal(const int val);

private:
    int mValue;
    void _notifyObserver();
    Observer* mObserver;
};