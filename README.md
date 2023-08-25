# IT-Project-6-People

These are the members that make up our team (sorted in alphabetical order!)

| **Name** | **Student Code** | **Email** |
|-------------------|------------------	|----------- |
|Callum Sharman| | |
|James La Fortaine| | |
|Jun Youn |1171924|younj@student.unimelb.edu.au|
| Ryan Goh | | |
| Yan Zong Goh | | |

## Basic Setup

Programs you will need to install

- [Python (v3.11.4)](https://www.python.org/downloads/windows)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (installion requires rebo)
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

    ```it=project-6-people-webapp-1``` The server is running if you see ```it-project-6-people-webapp-1  | Watching for file changes with StatReloader```, the server is running!

   If you want to view the website, go to localhost:8000 in your browser.

4. To stop everything, press CTRL+C in the terminal and wait


If you want to run the db and webapp separately, then

- ```docker compose run db``` to run the server in its own container

    This will make a randomly named container (not it-project-6-people-db-1). 
    
    I personally don't recommend doing this, but rather:

- ```docker compose run webapp``` to run the webapp (this might take a bit)

    ```it-project-6-people-db-1``` is created and run, but the webapp container isn't called ```it-project-6-people-webapp-1```.
    
    I like this command more than ```docker compose up```, as you can quit the server with CTRL+C but have ```it-project-6-people-db-1 run``` in the background, meaning you can run ```docker compose run webapp``` over and over with any relevant changes made to the Django code but have the database untouched (to my knowledge?)
