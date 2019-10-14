#include "notifications.h"
#include "ui_notification.h"
#include <QTimer>
#include <QPixmap>
#include <QHash>
#include <QApplication>
#include <QScreen>
#include <QStyle>
#include <QSound>
#include "settings.h"

#include <QDebug>

Notifications::Notifications(const std::shared_ptr<Settings> &settings, QWidget *parent) : QWidget(parent), settings(settings)
{
    setWindowFlags(Qt::ToolTip | Qt::FramelessWindowHint);
    setLayout(new QVBoxLayout(this));
    setAttribute( Qt::WA_TranslucentBackground, true );
    updateVisibility();
    setSizePolicy({QSizePolicy::Minimum, QSizePolicy::Minimum});
}

void Notifications::notify(const QString &serverName, const QString &title, const QString &text, Notification::Type type, int msTimeout)
{
    static QHash<Notification::Type, QString> sounds {
        {Notification::Error, ":/astrophotoplus/error.wav"},
        {Notification::Warning, ":/astrophotoplus/warning.wav"},
        {Notification::Info, ":/astrophotoplus/info.wav"},
        {Notification::Success, ":/astrophotoplus/success.wav"},
    };
    if(settings->notificationSoundEnabled(type)) {
        QSound::play(sounds[type]);
    }
    auto notification = new Notification(serverName, title, text, type, msTimeout, this);
    notifications.append(notification);
    connect(notification, &Notification::destroyed, this, [this, notification](QObject *) {
        notifications.removeAll(notification);
        updateVisibility();
    });
    layout()->addWidget(notification);
    layout()->setSizeConstraint(QLayout::SetFixedSize);
    updateVisibility();
}

void Notifications::updateVisibility()
{
    auto desktopGeometry = qApp->primaryScreen()->geometry();

    setVisible(!notifications.isEmpty());
    setGeometry(QStyle::alignedRect(Qt::LeftToRight, Qt::AlignTop| Qt::AlignRight, size(), desktopGeometry));
}


Notification::Notification(const QString &serverName, const QString &title, const QString &text, Notification::Type type, int msTimeout, QWidget *parent) : QFrame(parent), ui(std::make_unique<Ui::Notification>())
{
    static QHash<Notification::Type, QPixmap> typeIcons {
        {Notification::Info, QPixmap(":/astrophotoplus/info.png")},
        {Notification::Success, QPixmap(":/astrophotoplus/success.png")},
        {Notification::Error, QPixmap(":/astrophotoplus/error.png")},
        {Notification::Warning, QPixmap(":/astrophotoplus/warning.png")},
    };
    ui->setupUi(this);
    ui->titleLabel->setText(title);
    ui->textLabel->setText(text);
    ui->serverNameLabel->setText(serverName);
    if(msTimeout) {
        QTimer::singleShot(msTimeout, this, &QWidget::deleteLater);
    }
    auto palette = this->palette();
    palette.setColor(QPalette::Background, QColor(0,0,0,190));
    ui->statusLabel->setPixmap(typeIcons[type]);
    setPalette(palette);
    setAutoFillBackground(true);
}

Notification::~Notification()
{
}

void Notification::mousePressEvent(QMouseEvent *)
{
    this->deleteLater();
}
