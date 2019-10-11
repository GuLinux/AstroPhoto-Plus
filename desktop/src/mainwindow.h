#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QList>
#include <memory>

namespace Ui {
class MainWindow;
}

class QWebEngineView;
class QSettings;
class QSystemTrayIcon;
class QIcon;
class QPushButton;
class ServerDiscovery;

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_actionRemote_server_triggered();
    void loadWebPage(const QString &address);
    void on_pushButton_clicked();
    void onPageLoaded(bool ok);
    void recentServersGroup();
    void discoveredServersGroup();
private:
    std::unique_ptr<Ui::MainWindow> ui;
    std::unique_ptr<QSettings> settings;
    std::unique_ptr<QIcon> appicon;
    std::unique_ptr<ServerDiscovery> serverDiscovery;
    QWebEngineView *webengine;
    QSystemTrayIcon *systray;

    void configureNotifications();
    QList<QPushButton*> recentServersButtons;
    QList<QPushButton*> localServersButtons;
};

#endif // MAINWINDOW_H
