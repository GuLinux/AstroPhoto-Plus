#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QJsonDocument>
#include <QInputDialog>
#include <QtWebEngineWidgets/QWebEngineView>
#include <QtWebEngineWidgets/QWebEngineProfile>
#include <QtWebEngineCore/QWebEngineNotification>
#include <QDebug>
#include <QSettings>
#include <QSystemTrayIcon>
#include <QIcon>
#include <QUrl>
#include <QUuid>
#include <QMessageBox>
#include "customwebpage.h"
#include "serverdiscovery.h"
#include "api.h"

#define MAX_RECENT_SERVERS 10

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(std::make_unique<Ui::MainWindow>()),
    settings(std::make_unique<QSettings>("GuLinux", "AstroPhoto-Plus")),
    appicon(std::make_unique<QIcon>(":/astrophotoplus/appicon")),
    api(std::make_unique<API>()),
    sessionId(QUuid::createUuid().toString(QUuid::Id128))
{
    ui->setupUi(this);
    systray = new QSystemTrayIcon(*appicon, this);
    setWindowIcon(*appicon);

    ui->recentServersGroup->setLayout(new QVBoxLayout());
    ui->autodiscoveredServersGroup->setLayout(new QVBoxLayout());

    restoreGeometry(settings->value("window_geometry", QByteArray()).toByteArray());
    restoreState(settings->value("window_state", QByteArray()).toByteArray());

    connect(ui->manualServerButton, &QPushButton::clicked, this, &MainWindow::on_actionRemote_server_triggered);
    webengine = new QWebEngineView(this);
    webengine->setPage(new CustomWebPage(sessionId, webengine));

    ui->stackedWidget->addWidget(webengine);
    ui->autodiscoveredServersGroup->hide();
    recentServersGroup();
    systray->show();
    serverDiscovery = std::make_unique<ServerDiscovery>();
    connect(serverDiscovery.get(), &ServerDiscovery::serversUpdated, this, &MainWindow::discoveredServersGroup);
    serverDiscovery->start();
    connect(api.get(), &API::serverOk, this, [this](const QString &serverName, const QUrl &serverUrl) {
        this->webengine->load(serverUrl);
        this->ui->stackedWidget->setCurrentIndex(1);
        addServerToHistory(serverName, serverUrl);
    });
    connect(api.get(), &API::serverSentEvent, this, &MainWindow::eventReceived);

    connect(api.get(), &API::serverError, this, [this](const QString &errorMessage, const QUrl &serverUrl) {
        QMessageBox::warning(this, tr("Connection Error"), tr("An error occured while connecting to server %1.\n%2").arg(serverUrl.toString()).arg(errorMessage));
    });

    connect(api.get(), &API::serverInvalid, this, [this](const QUrl &serverUrl) {
        QMessageBox::warning(this, tr("Invalid Server"), tr("The server at address %1 doesn't seem to be a valid AstroPhoto Plus server.").arg(serverUrl.toString()));
    });

}

MainWindow::~MainWindow()
{
    settings->setValue("window_geometry", this->saveGeometry());
    settings->setValue("window_state", this->saveState());
    serverDiscovery->stop();
    qDebug() << "Saved state and geometry";
}



void MainWindow::on_actionRemote_server_triggered()
{
    auto address = QInputDialog::getText(this, "Server Address", "Enter remote server URL (example: http://localhost:80");
    if(address.size() && address.startsWith("http")) {
        this->loadWebPage(address);
    }
}

void MainWindow::loadWebPage(const QString &address) {
    this->api->scanHost({address});
}

void MainWindow::addServerToHistory(const QString &serverName, const QUrl &serverUrl) {
    settings->beginGroup("RecentServers");
    auto recentServers = settings->value("recent_servers").toStringList();
    recentServers.removeAll(serverUrl.toString());
    recentServers.push_back(serverUrl.toString());
    while(recentServers.size() > MAX_RECENT_SERVERS) {
        auto removedServerName = recentServers.takeFirst();
        settings->remove(removedServerName + "_name");
    }
    settings->setValue("recent_servers", recentServers);
    settings->setValue(serverUrl.toString() + "_name", serverName);
    settings->endGroup();
    recentServersGroup();
}

void MainWindow::recentServersGroup()
{
    settings->beginGroup("RecentServers");
    recentServersButtons.clear();
    auto recentServers = settings->value("recent_servers").toStringList();
    if(recentServers.empty()) {
        ui->recentServersGroup->hide();
        settings->endGroup();
        return;
    }
    ui->recentServersGroup->show();
    for(auto server = recentServers.crbegin(); server != recentServers.crend(); server++) {
        ServerInfo serverInfo{settings->value((*server) + "_name").toString(), QUrl(*server)};
        recentServersButtons.append(serverButton(serverInfo.displayName(), serverInfo.url, ui->recentServersGroup->layout()));
    }
    settings->endGroup();
}

void MainWindow::discoveredServersGroup()
{
    localServersButtons.clear();
    if(serverDiscovery->servers().empty()) {
        ui->autodiscoveredServersGroup->hide();
        return;
    }
    ui->autodiscoveredServersGroup->show();
    for(auto server: serverDiscovery->servers()) {
        localServersButtons.append(serverButton(server.displayName(), server.url, ui->autodiscoveredServersGroup->layout()));
    }
}

void MainWindow::eventReceived(const QMap<QString, QString> &event)
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

std::shared_ptr<QPushButton> MainWindow::serverButton(const QString &serverName, const QUrl &serverAddress, QLayout *layout)
{
    auto button = std::make_shared<QPushButton>(serverName);
    layout->addWidget(button.get());
    connect(button.get(), &QPushButton::clicked, this, [this, serverAddress]() {
        this->loadWebPage(serverAddress.toString());
    });
    return button;
}
