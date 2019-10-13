#include "api.h"
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>

#include <QJsonDocument>

#include <QDebug>
#include <QTimer>


API::API() : QObject(), manager(std::make_unique<QNetworkAccessManager>())
{
}

API::~API()
{
}

void API::scanHost(const QUrl &baseUrl)
{
    auto onError = [this, baseUrl](QNetworkReply *reply) {
        if(reply->error() != QNetworkReply::NoError) {
            this->serverError(reply->errorString(), baseUrl);
        } else {
            this->serverInvalid(baseUrl);
        }
    };
    auto onSettingsFetched = [this, baseUrl](const QVariant &json, QNetworkReply *) {
        emit this->serverOk(json.toMap().value("server_name").toString(), baseUrl);
        this->startSSE(baseUrl);
    };

    auto onVersionFetched = [this, baseUrl, onSettingsFetched, onError](const QVariant &json, QNetworkReply *) {
        qDebug() << "Detected AstroPhotoPlus server, version " << json.toMap()["version"].toString();
        auto settingsUrl = baseUrl;
        settingsUrl.setPath("/api/settings");
        fetchJSON("GET", QNetworkRequest{settingsUrl}, onSettingsFetched, onError);
    };
    auto versionUrl = baseUrl;
    versionUrl.setPath("/api/version");
    fetchJSON("GET", QNetworkRequest{versionUrl}, onVersionFetched, onError);

}

void API::startSSE(const QUrl &baseUrl)
{
    auto url = baseUrl;
    url.setPath("/api/events");
    OnNetworkReplyError onError = [this, baseUrl](QNetworkReply *reply) {
        qWarning() << "Error on SSE on server" << baseUrl << ":" << reply->errorString() << ", retrying";
        QTimer::singleShot(1000, this, [this, baseUrl] { startSSE(baseUrl); });
    };
    auto reply = fetchJSON("GET", QNetworkRequest{url}, OnNetworkReplySuccess(), onError);
    connect(reply, &QNetworkReply::readyRead, this, [this, reply, baseUrl]{
        auto event = QString(reply->readAll()).trimmed().split('\n');
        QMap<QString, QString> eventData{
            {"url", baseUrl.toString()},
        };
        for(auto eventField: event) {
            auto tokenPosition = eventField.indexOf(':');
            eventData[eventField.mid(0, tokenPosition).trimmed()] = eventField.mid(tokenPosition+1).trimmed();
        }
        emit serverSentEvent(eventData);
    });
}

QNetworkReply *API::fetchJSON(const QString &method, const QNetworkRequest &request, const API::OnNetworkReplySuccess &onSuccess, const API::OnNetworkReplyError &onError, QIODevice *data)
{
    auto reply = manager->sendCustomRequest(request, method.toUtf8(), data);
    connect(reply, &QNetworkReply::finished, this, [onSuccess, onError, reply]{
        if(onSuccess && reply->header(QNetworkRequest::ContentTypeHeader).toString().contains("application/json")) {
            auto json = QJsonDocument::fromJson(reply->readAll());
            onSuccess(json.toVariant(), reply);
        } else {
            if(onError && reply->error() == QNetworkReply::NoError) {
                onError(reply);
            }
        }
        reply->deleteLater();
    });
    connect(reply, qOverload<QNetworkReply::NetworkError>(&QNetworkReply::error), this, [reply, onError](QNetworkReply::NetworkError){
        qDebug() << "An error occured requesting "<< reply->request().url() << reply->errorString();
        if(onError) {
            onError(reply);
        }
    });
    return reply;
}
