#include "customwebpage.h"
#include <QtWebEngineWidgets/QWebEngineProfile>
#include <QDebug>
#include <QHash>


CustomWebPage::CustomWebPage(QObject *parent) : QWebEnginePage(parent)
{
}

void CustomWebPage::javaScriptConsoleMessage(QWebEnginePage::JavaScriptConsoleMessageLevel level, const QString &message, int lineNumber, const QString &sourceID)
{
    Q_UNUSED(lineNumber)
    Q_UNUSED(sourceID)
    static QHash<QWebEnginePage::JavaScriptConsoleMessageLevel, QString> levels{
        { QWebEnginePage::InfoMessageLevel,    "INFO"},
        { QWebEnginePage::WarningMessageLevel, "WARN"},
        { QWebEnginePage::ErrorMessageLevel,    "ERR"},
    };
    qDebug().nospace().noquote() << "[JS][" << levels[level] << "] " << message;
}
