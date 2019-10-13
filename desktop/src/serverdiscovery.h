#ifndef SERVERDISCOVERY_H
#define SERVERDISCOVERY_H

#include <QObject>
#include <atomic>
#include <memory>
#include <QUrl>

class QUdpSocket;
class atomic_bool;

struct ServerInfo {
    QString name;
    QUrl url;
    QString displayName() const;
    static ServerInfo parse(const QByteArray &data, const QString &host);
    bool operator==(const ServerInfo &other) const;
};

class ServerDiscovery : public QObject
{
    Q_OBJECT
public:
    explicit ServerDiscovery(QObject *parent = nullptr);
    ~ServerDiscovery();
    QList<ServerInfo> servers() const { return _servers; }

signals:
    void serverFound(const QByteArray &data, const QString &host);
    void serversUpdated();

public slots:
    void start();
    void stop();
private slots:
    void parseNewServer(const QByteArray &data, const QString &host);

private:
    std::shared_ptr<std::atomic_bool> __run_thread;
    QList<ServerInfo> _servers;
};

#endif // SERVERDISCOVERY_H
