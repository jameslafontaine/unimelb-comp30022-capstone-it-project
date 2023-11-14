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

Assuming using Windows - Programs you will need to install

- [Python (v3.11.4)](https://www.python.org/downloads/windows)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (installion requires reboot)
- [MySQL (v8.0.34)](https://dev.mysql.com/downloads/installer/), I downloaded mysql-installer-community-8.0.34.0.msi. Just did default settings for everything, 

After installing these settings, you can

1. Clone the repository onto your device

2. Use the terminal to navigate into ```IT-Project-6-People```

3. Run the following command

    ```pip install -r requirements. txt```

4. Django and any necessary dependencies should now be installed!


## Running the app

Have Docker Desktop open, or you'll get an error

1. Navigate into root directory ```IT-Project-6-People``` in your terminal 

2. If first time running, then run ```docker compose build && docker compose up```

3. If not the first time running, run ```docker compose down && docker volume prune``` and ```docker compose build && docker compose up``` again

4. If you see

    ```it-project-6-people-webapp-1  | Watching for file changes with StatReloader```

    The app is running! Go to ```localhost:8000``` in your browser to use the app.

5. Press Ctrl+C in the terminal to stop the app.


## Configurability

```mock_database``` function enters fake data into ```./wait_for_db.py```. This could 
