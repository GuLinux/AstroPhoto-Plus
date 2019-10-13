#include "mainwindow.h"
#include "ui_mainwindow.h"

#include <QInputDialog>
#include <QDebug>
#include "settings.h"
#include <QIcon>
#include <QUrl>
#include <QTabBar>

#include "customwebpage.h"
#include "astrophotopluswidget.h"
#include "serverdiscovery.h"
#include "notifications.h"


MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(std::make_unique<Ui::MainWindow>()),
    settings(std::make_shared<Settings>()),
    appicon(std::make_unique<QIcon>(":/astrophotoplus/icon-64"))
{
    ui->setupUi(this);
    layout()->setSpacing(0);
    layout()->setMargin(0);
    ui->homeTab->layout()->setSpacing(0);
    ui->homeTab->layout()->setMargin(0);
    //ui->scrollArea->layout()->setMargin(0);
    setWindowIcon(*appicon);

    ui->recentServersGroup->setLayout(new QVBoxLayout());
    ui->autodiscoveredServersGroup->setLayout(new QVBoxLayout());

    restoreGeometry(settings->windowGeometry());
    restoreState(settings->windowState());

    connect(ui->manualServerButton, &QPushButton::clicked, this, &MainWindow::on_actionRemote_server_triggered);

    this->notifications = new Notifications(settings, this);

    ui->autodiscoveredServersGroup->hide();
    ui->tabWidget->tabBar()->setTabButton(0, QTabBar::RightSide, nullptr);
    connect(ui->tabWidget, &QTabWidget::tabCloseRequested, this, [this](int index){
        delete ui->tabWidget->widget(index);
    });
    recentServersGroup();
    ui->soundInfo->setChecked(settings->notificationSoundEnabled(Notification::Info));
    ui->soundErrors->setChecked(settings->notificationSoundEnabled(Notification::Error));
    ui->soundSuccess->setChecked(settings->notificationSoundEnabled(Notification::Success));
    ui->soundWarnings->setChecked(settings->notificationSoundEnabled(Notification::Warning));

    connect(ui->soundInfo, &QCheckBox::toggled, this, [this](bool checked){ settings->setNotificationSoundEnabled(Notification::Info, checked); });
    connect(ui->soundErrors, &QCheckBox::toggled, this, [this](bool checked){ settings->setNotificationSoundEnabled(Notification::Error, checked); });
    connect(ui->soundWarnings, &QCheckBox::toggled, this, [this](bool checked){ settings->setNotificationSoundEnabled(Notification::Warning, checked); });
    connect(ui->soundSuccess, &QCheckBox::toggled, this, [this](bool checked){ settings->setNotificationSoundEnabled(Notification::Success, checked); });

    serverDiscovery = std::make_unique<ServerDiscovery>();
    connect(serverDiscovery.get(), &ServerDiscovery::serversUpdated, this, &MainWindow::discoveredServersGroup);
    serverDiscovery->start();
}

MainWindow::~MainWindow()
{
    settings->setWindowGeometry(saveGeometry());
    settings->setWindowState(saveState());
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
    auto astroPhotoPlusWidget = new AstroPhotoPlusWidget(address, notifications);
    connect(astroPhotoPlusWidget, &AstroPhotoPlusWidget::serverLoaded, this, [this, astroPhotoPlusWidget](const QString &name, const QUrl &address) {
        ui->tabWidget->addTab(astroPhotoPlusWidget, name.isEmpty() ? address.toString() : name);
        addServerToHistory(name, address);
        ui->tabWidget->setCurrentWidget(astroPhotoPlusWidget);
    });
    astroPhotoPlusWidget->openServer();
}

void MainWindow::addServerToHistory(const QString &serverName, const QUrl &serverUrl) {
    settings->addRecentServer({serverName, serverUrl});
    recentServersGroup();
}

void MainWindow::recentServersGroup()
{
    auto recentServers = settings->recentServers();
    recentServersButtons.clear();
    if(recentServers.empty()) {
        ui->recentServersGroup->hide();
        return;
    }
    ui->recentServersGroup->show();
    for(auto serverInfo: recentServers) {
        recentServersButtons.append(serverButton(serverInfo.displayName(), serverInfo.url, ui->recentServersGroup->layout()));
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
