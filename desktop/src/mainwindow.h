#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <memory>

namespace Ui {
class MainWindow;
}

class QWebEngineView;
class QSettings;

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

private:
    std::unique_ptr<Ui::MainWindow> ui;
    std::unique_ptr<QSettings> settings;
    QWebEngineView *webengine;
};

#endif // MAINWINDOW_H
