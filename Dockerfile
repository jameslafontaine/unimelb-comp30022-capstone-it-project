FROM python:3.11.4

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY wait_for_db.py /wait_for_db.py
RUN chmod +x /wait_for_db.py

EXPOSE 8000

ENTRYPOINT ["python", "wait_for_db.py", "db", "3306", "root", "admin"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]