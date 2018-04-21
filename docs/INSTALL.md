# StarQuew Installation

## Requirements

 - python (recommended version 3)
 - pip
 - indi server
 - npm
 - web server (nginx recommended)
 - swig
 
## Install project dependencies

This howto will assume you downloaded *StarQuew* source code in `$HOME/StarQuew`. Change paths accordingly where required.

### Install python dependencies

*note*: this might take a while

```
cd $HOME/StarQuew/backend
sudo pip install -r requirements.txt
```

### Configure backend

Configuration of backend is currently done via environment variables.
Just export one of the following variables in your shell before starting the backend server. You can also put them in your bash profile.

 - `STARQUEW_SEQUENCES_PATH`: directory where sequences will be saved. Defaults to `$HOME/StarQuew-Data`


### Start backend server

```
cd $HOME/StarQuew/backend
./start-server
```

### Install frontend dependencies and compile frontend

```
cd $HOME/StarQuew/frontend
npm install
npm run build
```

The compiled resources will be in `$HOME/StarQuew/frontend/build`

### Configure and start nginx

Copy the file [star-quew.conf](star-quew.conf) in `/etc/nginx/sites-available`.

Modify the file, replacing the path:
```
        root /home/pi/StarQuew/frontend/build/;
```
to where your frontend build directory actually is.

Remove the default site nginx configuration file, and enable `star-quew.conf`:
```
sudo rm -f /etc/nginx/sites-enabled/*
sudo ln -s /etc/nginx/sites-available/star-quew.conf /etc/nginx/sites-enabled/
```

Restart nginx:
```
sudo systemctl restart nginx
```


### Done

open your browser to `http://localhost` (change if you configured a remote server), *StarQuew* should now be up and running.

