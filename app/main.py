from fastapi import FastAPI
from collections import defaultdict

app = FastAPI()

queues = defaultdict(list)

# Admit a user from a queue
@app.get("/{queue_id}/admit")
def admit_user(queue_id: int):
    return {"message": f"User {queues[queue_id].pop(0)} removed from queue"}

# Get the queue
@app.get("/{queue_id}")
def get_queue(queue_id: int):
    return {"queue": queues[queue_id]}

# Get the front of a queue
@app.get("/{queue_id}/front")
def get_front(queue_id: int):
    return {"front": queues[queue_id][0]}

# Get the position of a user in a queue
@app.get("/{queue_id}/pos/{user_id}")
def get_pos(queue_id: int, user_id: int):
    return {"postion": queues[queue_id].index(user_id) + 1}

# Add a user to a queue
@app.put("/{queue_id}/add/{user_id}")
def add_user(queue_id: int, user_id: int):
    queues[queue_id].append(user_id)
    return {"message": f"User {user_id} added to queue"}

# Remove a user from a queue
@app.delete("/{queue_id}/remove/{user_id}")
def remove_user(queue_id: int, user_id: int):
    queues[queue_id].remove(user_id)
    return {"message": f"User {user_id} removed from queue"}