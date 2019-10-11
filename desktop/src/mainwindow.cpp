#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QInputDialog>
#include <QtWebEngineWidgets/QWebEngineView>
#include <QtWebEngineWidgets/QWebEngineProfile>
#include <QtWebEngineCore/QWebEngineNotification>
#include <QDebug>
#include <QSettings>
#include <QSystemTrayIcon>
#include <QIcon>
#include <QUrl>
#include "serverdiscovery.h"

#define MAX_RECENT_SERVERS 10

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow()),
    settings(new QSettings("GuLinux", "AstroPhoto-Plus")),
    appicon(new QIcon(":/astrophotoplus/appicon"))
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
    ui->stackedWidget->addWidget(webengine);
    connect(webengine, &QWebEngineView::loadFinished, this, &MainWindow::onPageLoaded);
    this->configureNotifications();
    ui->autodiscoveredServersGroup->hide();
    recentServersGroup();
    systray->show();
    serverDiscovery = std::make_unique<ServerDiscovery>();
    connect(serverDiscovery.get(), &ServerDiscovery::serversUpdated, this, &MainWindow::discoveredServersGroup);
    serverDiscovery->start();
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
    this->webengine->load(address);
    this->ui->stackedWidget->setCurrentIndex(1);
}

void MainWindow::on_pushButton_clicked()
{
   this->loadWebPage("https://google.com");
}

void MainWindow::onPageLoaded(bool ok) {
    if(ok) {
        auto recentServers = settings->value("recent_servers").toStringList();
        auto sanitizedURL = QUrl(webengine->page()->url()).toString();
        recentServers.removeAll(sanitizedURL);
        recentServers.push_back(sanitizedURL);
        while(recentServers.size() > MAX_RECENT_SERVERS) {
            recentServers.removeFirst();
        }
        settings->setValue("recent_servers", recentServers);
        recentServersGroup();
        qDebug() << "Page loaded:"<< webengine->page()->url();
    }
}

void MainWindow::recentServersGroup()
{
    recentServersButtons.clear();
    auto recentServers = settings->value("recent_servers").toStringList();
    if(recentServers.empty()) {
        ui->recentServersGroup->hide();
        return;
    }
    ui->recentServersGroup->show();
    for(auto server = recentServers.crbegin(); server != recentServers.crend(); server++) {
        auto button = new QPushButton(*server, ui->recentServersGroup);
        ui->recentServersGroup->layout()->addWidget(button);
        connect(button, &QPushButton::clicked, this, [this, server](){
            this->loadWebPage(*server);
        });
    }
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
        auto button = new QPushButton(server.displayName(), ui->autodiscoveredServersGroup);
        ui->autodiscoveredServersGroup->layout()->addWidget(button);
        connect(button, &QPushButton::clicked, this, [this, server]() {
            this->loadWebPage(server.url().toString());
        });
    }
}

void MainWindow::configureNotifications() {
     connect(webengine->page(), &QWebEnginePage::featurePermissionRequested, [&] (const QUrl &origin, QWebEnginePage::Feature feature) {
         qDebug() << "featurePermiussionRequested: " << origin << feature;
        if (feature != QWebEnginePage::Notifications)
            return;
        webengine->page()->setFeaturePermission(origin, feature, QWebEnginePage::PermissionGrantedByUser);
     });
     auto showNotifications = [this](const std::unique_ptr<QWebEngineNotification> &notification) {
         qDebug() << "title: " << notification->title() << ", message: " << notification->message() << ", tag: " << notification->tag() << ", origin: " << notification->origin();
         systray->showMessage(QString("AstroPhoto Plus\n%1").arg(notification->title()), notification->message(), *appicon);
     };
     webengine->page()->profile()->setNotificationPresenter(showNotifications);
}
