#ifndef API_H
#define API_H

#include <QObject>
#include <QUrl>
#include <memory>
#include <functional>

class QNetworkAccessManager;
class QNetworkReply;
class QNetworkRequest;
class QByteArray;
class QIODevice;
class API : public QObject
{
Q_OBJECT
public:
    API();
    ~API();
public slots:
    void scanHost(const QUrl &baseUrl);
private slots:
    void startSSE(const QUrl &baseUrl);
signals:
    void serverOk(const QString &name, const QUrl &address);
    void serverInvalid(const QUrl &address);
    void serverError(const QString &error, const QUrl &address);
    void serverSentEvent(const QMap<QString, QString> &event);
private:
    std::unique_ptr<QNetworkAccessManager> manager;
    QUrl baseUrl;
    typedef std::function<void(const QVariant &, QNetworkReply *)> OnNetworkReplySuccess;
    typedef std::function<void(QNetworkReply *)> OnNetworkReplyError;
    QNetworkReply *fetchJSON(const QString &method, const QNetworkRequest &request, const OnNetworkReplySuccess &onSuccess, const OnNetworkReplyError &onError, QIODevice *data=nullptr);
};

#endif // API_H
