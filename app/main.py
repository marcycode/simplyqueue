from fastapi import FastAPI

app = FastAPI()

queue = []

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.put("/add/{user_id}")
def add_user(user_id: int):
    queue.append(user_id)
    return {"message": f"User {user_id} added to queue"}

@app.get("/admit")
def admit_user():
    return {"message": f"User {queue.pop(0)} removed from queue"}

@app.get("/queue")
def get_queue():
    return {"queue": queue}

@app.get("/pos/{user_id}")
def get_pos(user_id: int):
    return {"message": f"User {user_id} is at position {queue.index(user_id) + 1} in the queue"}

@app.delete("/remove/{user_id}")
def remove_user(user_id: int):
    queue.remove(user_id)
    return {"message": f"User {user_id} removed from queue"}

