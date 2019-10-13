#include "settings.h"
#include <QSettings>


#define MAX_RECENT_SERVERS 10

Settings::Settings() : settings(std::make_unique<QSettings>("GuLinux", "AstroPhoto-Plus"))
{
}

Settings::~Settings()
{
}

QByteArray Settings::windowGeometry() const
{
    return settings->value("window_geometry", QByteArray()).toByteArray();
}

void Settings::setWindowGeometry(const QByteArray &geometry)
{
    settings->setValue("window_geometry", geometry);
}

QByteArray Settings::windowState() const
{
    return settings->value("window_state", QByteArray()).toByteArray();
}

void Settings::setWindowState(const QByteArray &state)
{
    settings->setValue("window_state", state);
}

QList<ServerInfo> Settings::recentServers() const
{
    settings->beginGroup("RecentServers");
    auto recentServers = settings->value("recent_servers").toStringList();
    QList<ServerInfo> servers;
    for(auto server = recentServers.crbegin(); server != recentServers.crend(); server++) {
        ServerInfo serverInfo{settings->value((*server) + "_name").toString(), QUrl(*server)};
        servers.append(serverInfo);
    }
    settings->endGroup();
    return servers;
}

void Settings::addRecentServer(const ServerInfo &server)
{
    settings->beginGroup("RecentServers");
    auto recentServers = settings->value("recent_servers").toStringList();
    recentServers.removeAll(server.url.toString());
    recentServers.push_back(server.url.toString());
    while(recentServers.size() > MAX_RECENT_SERVERS) {
        auto removedServerName = recentServers.takeFirst();
        settings->remove(removedServerName + "_name");
    }
    settings->setValue("recent_servers", recentServers);
    settings->setValue(server.url.toString() + "_name", server.name);
    settings->endGroup();
}

QHash<Notification::Type, QString> notificationToSoundSetting {
    {Notification::Info,    "notification_sound_info"},
    {Notification::Success, "notification_sound_success"},
    {Notification::Error, "notification_sound_error"},
    {Notification::Warning, "notification_sound_warning"},
};

bool Settings::notificationSoundEnabled(Notification::Type type)
{
    static QHash<Notification::Type, bool> defaultValues {
        {Notification::Info, false},
        {Notification::Success, false},
        {Notification::Error, true},
        {Notification::Warning, true},
    };
    return settings->value(notificationToSoundSetting[type], defaultValues[type]).toBool();
}

void Settings::setNotificationSoundEnabled(Notification::Type type, bool enabled)
{
    settings->setValue(notificationToSoundSetting[type], enabled);
}
