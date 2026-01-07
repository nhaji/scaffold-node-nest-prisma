from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(2, 5) # Wait 2-5 seconds between tasks

    @task
    def index(self):
        self.client.get("/health")