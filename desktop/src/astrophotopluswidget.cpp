#include "astrophotopluswidget.h"
#include <QtWebEngineWidgets/QWebEngineView>
#include <QtWebEngineWidgets/QWebEngineProfile>
#include <QVBoxLayout>
#include <QUuid>
#include <QJsonDocument>
#include <QMessageBox>
#include <QApplication>
#include <QUrlQuery>

#include <notifications.h>

#include "api.h"
#include "customwebpage.h"

AstroPhotoPlusWidget::AstroPhotoPlusWidget(const QUrl &serverAddress, Notifications *notifications, QWidget *parent)
    : QWidget(parent), _serverAddress{serverAddress}, api{std::make_unique<API>()}, sessionId(QUuid::createUuid().toString()), notifications(notifications)
{
    qDebug() << "New AstroPhotoPlus widget for url " << serverAddress << " with UUID=" << sessionId;
    auto layout = new QVBoxLayout(this);
    layout->setSpacing(0);
    layout->setMargin(0);
    setLayout(layout);
    layout->addWidget(this->webengine = new QWebEngineView(this));

    webengine->setPage(new CustomWebPage(webengine));
    hide();
    connect(api.get(), &API::serverOk, this, [this](const QString &serverName, const QUrl &serverUrl) {
        this->serverName = serverName;
        auto initialUrl = serverUrl;
        QUrlQuery query;
        query.addQueryItem("desktopClientSessionId", sessionId);
        initialUrl.setQuery(query);
        this->webengine->load(initialUrl);
        emit serverLoaded(serverName, serverUrl);
    });
    connect(api.get(), &API::serverSentEvent, this, &AstroPhotoPlusWidget::eventReceived);

    connect(api.get(), &API::serverError, this, [this](const QString &errorMessage, const QUrl &serverUrl) {
        QMessageBox::warning(nullptr, tr("Connection Error"), tr("An error occured while connecting to server %1.\n%2").arg(serverUrl.toString()).arg(errorMessage));
        this->deleteLater();
    });

    connect(api.get(), &API::serverInvalid, this, [this](const QUrl &serverUrl) {
        QMessageBox::warning(nullptr, tr("Invalid Server"), tr("The server at address %1 doesn't seem to be a valid AstroPhoto Plus server.").arg(serverUrl.toString()));
        this->deleteLater();
    });

}

AstroPhotoPlusWidget::~AstroPhotoPlusWidget()
{
    qDebug() << "Closing AstroPhotoPlus widget instance: " << serverName << _serverAddress;
}

void AstroPhotoPlusWidget::openServer()
{
    api->scanHost(this->_serverAddress);
}


void AstroPhotoPlusWidget::eventReceived(const QMap<QString, QString> &event)
{
    static QHash<QString, Notification::Type> iconMap {
        {"error", Notification::Error},
        {"warning", Notification::Warning},
        {"info", Notification::Info},
        {"success", Notification::Success},
    };
    if(event["event"] == "desktop") {
        auto jsonData = QJsonDocument::fromJson(event["data"].toUtf8()).toVariant().toMap();
        if(jsonData["event"] == "notification") {
            auto payload = jsonData["payload"].toMap();
            if(payload["desktopNotificationsUuid"] == this->sessionId) {
                notifications->notify(serverName, payload["title"].toString(), payload["text"].toString(), iconMap.value(payload["type"].toString(), Notification::Info), payload["timeout"].toInt());
            }
        }
    }
}
