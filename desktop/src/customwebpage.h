#ifndef CUSTOMWEBPAGE_H
#define CUSTOMWEBPAGE_H

#include <QtWebEngineWidgets/QWebEnginePage>

class CustomWebPage : public QWebEnginePage
{
public:
    CustomWebPage(QObject *parent = nullptr);
protected:
    void javaScriptConsoleMessage(JavaScriptConsoleMessageLevel level, const QString &message, int lineNumber, const QString &sourceID) override;
};

#endif // CUSTOMWEBPAGE_H
