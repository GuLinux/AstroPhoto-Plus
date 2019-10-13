#ifndef SETTINGS_H
#define SETTINGS_H
#include <memory>
#include <QByteArray>
#include <QUrl>
#include <QList>
#include "serverdiscovery.h"
#include "notifications.h"

class QSettings;
class Settings
{
public:
    Settings();
    ~Settings();

    QByteArray windowGeometry() const;
    void setWindowGeometry(const QByteArray &geometry);

    QByteArray windowState() const;
    void setWindowState(const QByteArray &state);

    QList<ServerInfo> recentServers() const;
    void addRecentServer(const ServerInfo &server);

    bool notificationSoundEnabled(Notification::Type type);
    void setNotificationSoundEnabled(Notification::Type type, bool enabled);
private:
    std::unique_ptr<QSettings> settings;
};

#endif // SETTINGS_H
