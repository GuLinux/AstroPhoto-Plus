#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QInputDialog>
#include <QtWebEngineWidgets/QWebEngineView>
#include <QDebug>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    connect(ui->manualServerButton, &QPushButton::clicked, this, &MainWindow::on_actionRemote_server_triggered);
    webengine = new QWebEngineView(this);
    ui->stackedWidget->addWidget(webengine);
    connect(webengine, &QWebEngineView::loadFinished, this, &MainWindow::onPageLoaded);
}

MainWindow::~MainWindow()
{
    delete ui;
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
        qDebug() << "connecting notifications handler";
        connect(webengine->page(), &QWebEnginePage::featurePermissionRequested,
         [&] (const QUrl &origin, QWebEnginePage::Feature feature) {
            qDebug() << "notification requested: " << origin << ", " << feature;
         if (feature != QWebEnginePage::Notifications)
             return;
         webengine->page()->setFeaturePermission(origin, feature, QWebEnginePage::PermissionGrantedByUser);
         });
    }
}
