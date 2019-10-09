#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

namespace Ui {
class MainWindow;
}

class QWebEngineView;

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
    Ui::MainWindow *ui;
    QWebEngineView *webengine;
};

#endif // MAINWINDOW_H
