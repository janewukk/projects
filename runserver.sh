sudo kill -9 $(ps aux | grep -e uwsgi | awk '{ print $2 }')

uwsgi --module web.wsgi --master --processes=2 --socket --enable-threads /var/www/perseus/perseus.sock --chmod-socket=666 