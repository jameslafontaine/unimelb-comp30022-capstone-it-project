import requests as rq

def fetch_all_user_ids(headers, params):
    all_user_ids = []
    base_url = 'https://canvas.instructure.com/api/v1/users'
    while base_url:
        response = rq.get(base_url, headers=headers, params=params)
        
        if response.status_code == 200 and response.text:
            data = response.json()
            
            for user in data:
                if 'id' in user:
                    all_user_ids.append(user['id'])
            
            if 'next' in response.links:
                base_url = response.links['next']['url']
            else:
                base_url = None

        # else:
            # print(f"Error {response.status_code}: {response.text}")

    return all_user_ids

if __name__ == "__main__":
    headers = {
        "Authorization": "Bearer 7~OcYkQYb52NI19cPauyXWRa0FAfO66YCg3iGBu9yEFudIiGcCnNT1IPfkXhNm7MmC"
    }

    params = {
        "per_page": 100
    }

    all_user_ids = fetch_all_user_ids(headers, params)

    for user_id in all_user_ids:
        print(user_id)
        break
