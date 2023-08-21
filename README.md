# IT-Project-6-People

(Name is tentative)

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


## Running the Application

To run the server through Docker, 

1. Navigate into the root directory ```IT-Project-6-People```

2. Run ```docker build -t canvasapp .``` 
    
    This build the docker image (this may take a while first run but consequent runs of this command are much faster)

3. Run ```docker run -it -p 8000:8000 canvasapp``` 

    This runs the image you just built. Navigate to localhost:8000 in your browser to look at your build.

4. To stop the server, just press CTRL+C in the terminal

5. If you make any changes, you have to rebuild the Docker image
