#include "mainwindow.h"
#include "ui_mainwindow.h"

#include <QInputDialog>
#include <QDebug>
#include <QSettings>
#include <QSystemTrayIcon>
#include <QIcon>
#include <QUrl>
#include <QTabBar>

#include "customwebpage.h"
#include "astrophotopluswidget.h"
#include "serverdiscovery.h"

#define MAX_RECENT_SERVERS 10

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(std::make_unique<Ui::MainWindow>()),
    settings(std::make_unique<QSettings>("GuLinux", "AstroPhoto-Plus")),
    appicon(std::make_unique<QIcon>(":/astrophotoplus/appicon"))
{
    ui->setupUi(this);
    layout()->setSpacing(0);
    layout()->setMargin(0);
    ui->homeTab->layout()->setSpacing(0);
    ui->homeTab->layout()->setMargin(0);
    //ui->scrollArea->layout()->setMargin(0);
    systray = new QSystemTrayIcon(*appicon, this);
    setWindowIcon(*appicon);

    ui->recentServersGroup->setLayout(new QVBoxLayout());
    ui->autodiscoveredServersGroup->setLayout(new QVBoxLayout());

    restoreGeometry(settings->value("window_geometry", QByteArray()).toByteArray());
    restoreState(settings->value("window_state", QByteArray()).toByteArray());

    connect(ui->manualServerButton, &QPushButton::clicked, this, &MainWindow::on_actionRemote_server_triggered);

    ui->autodiscoveredServersGroup->hide();
    ui->tabWidget->tabBar()->setTabButton(0, QTabBar::RightSide, nullptr);
    connect(ui->tabWidget, &QTabWidget::tabCloseRequested, this, [this](int index){
        delete ui->tabWidget->widget(index);
    });
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
    auto astroPhotoPlusWidget = new AstroPhotoPlusWidget(address, systray);
    connect(astroPhotoPlusWidget, &AstroPhotoPlusWidget::serverLoaded, this, [this, astroPhotoPlusWidget](const QString &name, const QUrl &address) {
        ui->tabWidget->addTab(astroPhotoPlusWidget, name.isEmpty() ? address.toString() : name);
        addServerToHistory(name, address);
        ui->tabWidget->setCurrentWidget(astroPhotoPlusWidget);
    });
    astroPhotoPlusWidget->openServer();
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


std::shared_ptr<QPushButton> MainWindow::serverButton(const QString &serverName, const QUrl &serverAddress, QLayout *layout)
{
    auto button = std::make_shared<QPushButton>(serverName);
    layout->addWidget(button.get());
    connect(button.get(), &QPushButton::clicked, this, [this, serverAddress]() {
        this->loadWebPage(serverAddress.toString());
    });
    return button;
}
