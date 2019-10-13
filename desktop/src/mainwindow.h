#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QList>
#include <QMap>
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
class API;

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_actionRemote_server_triggered();
    void loadWebPage(const QString &address);
    void addServerToHistory(const QString &serverName, const QUrl &serverUrl);
    void recentServersGroup();
    void discoveredServersGroup();
    void eventReceived(const QMap<QString, QString> &event);
private:
    std::unique_ptr<Ui::MainWindow> ui;
    std::unique_ptr<QSettings> settings;
    std::unique_ptr<QIcon> appicon;
    std::unique_ptr<ServerDiscovery> serverDiscovery;
    std::unique_ptr<API> api;
    QWebEngineView *webengine;
    QSystemTrayIcon *systray;
    const QString sessionId;

    QList<std::shared_ptr<QPushButton>> recentServersButtons;
    QList<std::shared_ptr<QPushButton>> localServersButtons;

    std::shared_ptr<QPushButton> serverButton(const QString &serverName, const QUrl &serverAddress, QLayout *layout);
};

#endif // MAINWINDOW_H
