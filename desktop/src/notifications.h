#ifndef NOTIFICATIONS_H
#define NOTIFICATIONS_H

#include <QWidget>
#include <QFrame>
#include <memory>
#include <QList>

class Settings;
namespace Ui {
    class Notification;
}
class Notification : public QFrame {
    Q_OBJECT
public:
    enum Type { Success, Info, Warning, Error };

    Notification(const QString &serverName, const QString &title, const QString &text, Notification::Type type, int msTimeout=0, QWidget *parent=nullptr);
    ~Notification();
protected:
    void mousePressEvent(QMouseEvent *event) override;
private:
    std::unique_ptr<Ui::Notification> ui;
};

class Notifications : public QWidget
{
    Q_OBJECT
public:
    explicit Notifications(const std::shared_ptr<Settings> &settings, QWidget *parent = nullptr);

signals:

public slots:
    void notify(const QString &serverName, const QString &title, const QString &text, Notification::Type type, int msTimeout = 0);
    void updateVisibility();
private:
    QList<QWidget *> notifications;
    std::shared_ptr<Settings> settings;
};

#endif // NOTIFICATIONS_H
