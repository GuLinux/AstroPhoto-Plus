#include <QApplication>
#include "mainwindow.h"

int main(int argc, char **argv) {
    QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
    QApplication app(argc, argv);
    MainWindow main_window;
    app.setQuitOnLastWindowClosed(true);
    main_window.show();
    return app.exec();
}
