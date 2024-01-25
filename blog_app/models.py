from django.db import models


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    post_date = models.DateTimeField(auto_now = True)
    
    
    def __str__(self) -> str:
        return self.title
    