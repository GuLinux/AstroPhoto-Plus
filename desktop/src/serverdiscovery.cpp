#include "serverdiscovery.h"
#include <QUdpSocket>
#include <QNetworkDatagram>
#include <QtConcurrent/QtConcurrent>
#include <QDebug>

ServerDiscovery::ServerDiscovery(QObject *parent) : QObject(parent), __run_thread(std::make_shared<std::atomic_bool>(false))
{
    connect(this, &ServerDiscovery::serverFound, this, &ServerDiscovery::parseNewServer, Qt::QueuedConnection);
}

ServerDiscovery::~ServerDiscovery()
{
    stop();
}

void ServerDiscovery::start()
{
    QtConcurrent::run([this]{
       QUdpSocket socket;
       auto bound = socket.bind(27181, QUdpSocket::ShareAddress);
       qDebug() << "Socket bound: " << bound;
       __run_thread->store(true);
       while(this->__run_thread->load()) {
           if(socket.hasPendingDatagrams()) {
               auto datagram = socket.receiveDatagram();
               emit serverFound(datagram.data(), datagram.senderAddress().toString());
           }
       }
    });
}

void ServerDiscovery::stop()
{
    this->__run_thread->store(false);
    qDebug() << "Stopping server discovery: " << this->__run_thread->load();
}

void ServerDiscovery::parseNewServer(const QByteArray &data, const QString &host)
{
    auto server = ServerInfo::parse(data, host);
    if(!this->_servers.contains(server)) {
        _servers.append(server);
        emit this->serversUpdated();
    }
}


QString ServerInfo::displayName() const
{
    if(!name.isEmpty()) {
        return QObject::tr("Server %1 at %2").arg(name).arg(url.toString());
    }
    return QObject::tr("Server at %1").arg(url.toString());
}

ServerInfo ServerInfo::parse(const QByteArray &data, const QString &host)
{
    auto tokens = data.split('\x1F');
    QUrl url;
    url.setHost(host);
    url.setPort(tokens[1].toInt());
    url.setScheme(tokens[3]);
    return { tokens[2], url};
}

bool ServerInfo::operator==(const ServerInfo &other) const
{
   return url == other.url;
}
