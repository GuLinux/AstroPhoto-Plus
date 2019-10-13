#include "astrophotopluswidget.h"
#include <QtWebEngineWidgets/QWebEngineView>
#include <QtWebEngineWidgets/QWebEngineProfile>
#include <QVBoxLayout>
#include <QUuid>
#include <QJsonDocument>
#include <QMessageBox>

#include <QSystemTrayIcon>

#include "api.h"
#include "customwebpage.h"

AstroPhotoPlusWidget::AstroPhotoPlusWidget(const QUrl &serverAddress, QSystemTrayIcon *systray, QWidget *parent)
    : QWidget(parent), serverAddress{serverAddress}, api{std::make_unique<API>()}, sessionId(QUuid::createUuid().toString(QUuid::Id128)), systray(systray)
{
    auto layout = new QVBoxLayout(this);
    layout->setSpacing(0);
    layout->setMargin(0);
    setLayout(layout);
    layout->addWidget(this->webengine = new QWebEngineView(this));

    webengine->setPage(new CustomWebPage(sessionId, webengine));
    hide();
    connect(api.get(), &API::serverOk, this, [this](const QString &serverName, const QUrl &serverUrl) {
        this->serverName = serverName;
        this->webengine->load(serverUrl);
        emit serverLoaded(serverName, serverUrl);
    });
    connect(api.get(), &API::serverSentEvent, this, &AstroPhotoPlusWidget::eventReceived);

    connect(api.get(), &API::serverError, this, [this](const QString &errorMessage, const QUrl &serverUrl) {
        QMessageBox::warning(this, tr("Connection Error"), tr("An error occured while connecting to server %1.\n%2").arg(serverUrl.toString()).arg(errorMessage));
        this->deleteLater();
    });

    connect(api.get(), &API::serverInvalid, this, [this](const QUrl &serverUrl) {
        QMessageBox::warning(this, tr("Invalid Server"), tr("The server at address %1 doesn't seem to be a valid AstroPhoto Plus server.").arg(serverUrl.toString()));
        this->deleteLater();
    });

}

AstroPhotoPlusWidget::~AstroPhotoPlusWidget()
{
    qDebug() << "Closing AstroPhotoPlus widget instance: " << serverName << serverAddress;
}

void AstroPhotoPlusWidget::openServer()
{
    api->scanHost(this->serverAddress);
}


void AstroPhotoPlusWidget::eventReceived(const QMap<QString, QString> &event)
{
    static QHash<QString, QSystemTrayIcon::MessageIcon> iconMap {
        {"error", QSystemTrayIcon::Critical},
        {"warning", QSystemTrayIcon::Warning},
        {"info", QSystemTrayIcon::Information},
        {"success", QSystemTrayIcon::Information},
    };
    if(event["event"] == "desktop") {
        auto jsonData = QJsonDocument::fromJson(event["data"].toUtf8()).toVariant().toMap();
        if(jsonData["event"] == "notification") {
            auto payload = jsonData["payload"].toMap();
            if(payload["desktopNotificationsUuid"] == this->sessionId) {
                systray->showMessage(
                    tr("AstroPhoto Plus"),
                    QString("<b>%1</b><br>%2").arg(payload["title"].toString()).arg(payload["text"].toString()),
                    iconMap.value(payload["type"].toString(), QSystemTrayIcon::NoIcon),
                    //*this->appicon,
                    payload["timeout"].toInt()
                );
            }
        }
    }
}
