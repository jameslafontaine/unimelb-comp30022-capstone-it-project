"""
CI - Check if docker compose up has finished initialising
"""

import time
import requests

def ci_check_django_running():
    '''Ping localhost:8000 every 5 seconds'''
    while True:
        try:
            response = requests.get("http://localhost:8000", timeout = 5)
            if response.status_code == 200:
                return True
            time.sleep(5)
        except requests.Timeout:
            time.sleep(5)

if __name__ == "__main__":
    ci_check_django_running()
