#ifndef ASTROPHOTOPLUSWIDGET_H
#define ASTROPHOTOPLUSWIDGET_H

#include <QWidget>
#include <memory>
#include <QUrl>

class API;
class QWebEngineView;
class Notifications;
class AstroPhotoPlusWidget : public QWidget
{
    Q_OBJECT
public:
    explicit AstroPhotoPlusWidget(const QUrl &_serverAddress, Notifications *notifications, QWidget *parent = nullptr);
    ~AstroPhotoPlusWidget();
    inline QUrl serverAddress() const { return _serverAddress; }

signals:
    void serverLoaded(const QString &serverName, const QUrl &_serverAddress);

public slots:
    void openServer();

private slots:
    void eventReceived(const QMap<QString, QString> &event);

private:
    const QUrl _serverAddress;
    const std::unique_ptr<API> api;
    const QString sessionId;
    Notifications *notifications;
    QString serverName;
    QWebEngineView *webengine;
};

#endif // ASTROPHOTOPLUSWIDGET_H
