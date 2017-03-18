FROM python:2-onbuild

EXPOSE 5000

CMD ["gunicorn", "-w 4", "-b 0.0.0.0:5000", "MainServer:app"]
