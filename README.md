# IT-Project-6-People

These are the members that make up our team

| **Name** | **Student Code** | **Email** |
|-------------------|------------------	|----------- |
|Callum Sharman|1171371|csharman@student.unimelb.edu.au|
|James La Fontaine|1079860|jlafontaine@student.unimelb.edu.au|
|Jun Youn |1171924|younj@student.unimelb.edu.au|
| Ryan Goh |1191761|rrgoh@student.unimelb.edu.au|
| Yan Zong Goh |1250945|yanzongg@student.unimelb.edu.au |

## Basic Setup

Programs you will need to install

- [Python (v3.11.4)](https://www.python.org/downloads/windows)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (installion requires reboot)
- [MySQL (v8.0.34)](https://dev.mysql.com/downloads/installer/), I downloaded mysql-installer-community-8.0.34.0.msi. Just did default settings for everything, 

After installing these settings, you can

1. Clone the repository onto your device

2. Use the terminal to navigate into ```IT-Project-6-People```

3. Run the following command

    ```pip install -r requirements. txt```

4. Django and any necessary dependencies should now be installed!


## Using Docker

Make sure you have Docker Desktop open (otherwise you'll get an error)

To run everything:

1. Navigate into root directory ```IT-Project-6-People``` in your terminal 

2. Run ```docker compose up``` in your terminal

    ```it-project-6-people-db-1``` is the database container. This runs tasks first to initialise all the database-related stuff within the container

    ```it=project-6-people-webapp-1``` 
    
    xThe server is running if you see 
    
    ```it-project-6-people-webapp-1  | Watching for file changes with StatReloader```
    
    The server is running! Go to localhost:8000 in your browser.

4. To stop everything, press CTRL+C in the terminal and wait


## Using Django

### Viewing any changes made

1. Navigate to ```IT-Project-6-people```

2. Run ```docker compose down```

3. Open Docker, go to Images and delete ```it-project-6-people-webapp```

4. Run ```docker compose up``` and go to ```localhost:8000``` to see any changes made to Django

### Creating a new app

1. Navigate into ```IT-Project-6-people```

2. Run ```python manage.py startapp <<app_name>>```

    e.g instructorView, studentView

3. Open ```canvasApp/settings.py``` and add ```<<app_name>>``` into the INSTALLED_APPS list


### Attaching HTML files to a URL

1. Make a new directory ```<<app_name>>/templates```

2. Put desired HTML files in above directory (e.g ```instructorView/templates/home.html```)

3. Open ```<<app_name>>/views.py``` and create a new function for that html (e.g ```def home_view(request):```)

    Function should look like

    ```Python
    def func_name(request):
        return render(request, 'home.html', {})
    ```

4. Open ```canvasApp/urls.py``` and add

    ```Python
    from <<app_name>>.views import func_name
    urlpatterns = [
    ...
    path('url/', func_name, name='home')
    ]
    ```

    This will load the HTML to ```localhost:8000/url/```


### Attaching CSS, JS or images to a HTML

1. Make a directory ```<<app_name>>/static/<<app_name>>/``` and put in any CSS/JS/images there

2. Go into the HTML file and make changes like such

    ```HTML
    {% load static %}

    <!DOCTYPE html>
    ...
    <img src="{% static '<<app_name>>/uomLogo.JPG' %}" style="height: 38px;">
    ...
    ```