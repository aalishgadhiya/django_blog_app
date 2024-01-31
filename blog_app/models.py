from django.db import models
from django.contrib.auth.models import User


class Blogger(models.Model):
    user = models.OneToOneField(User,on_delete = models.CASCADE)
    bio = models.TextField()   
    
    
    def __str__(self) -> str:
        return self.user.username


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    post_date = models.DateTimeField(auto_now = True)
    author = models.ForeignKey(Blogger,on_delete = models.CASCADE,null=True)
    
    
    def __str__(self) -> str:
        return self.title



    
    