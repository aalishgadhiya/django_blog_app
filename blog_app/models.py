from django.db import models
from django.contrib.auth.models import User


class Bloggers(models.Model):
    user = models.OneToOneField(User,on_delete = models.CASCADE)
    bio = models.TextField()   
    
    
    def __str__(self) -> str:
        return self.user.username


class Blog_posts(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    post_date = models.DateTimeField(auto_now = True)
    author = models.ForeignKey(Bloggers,on_delete = models.CASCADE,null=True)
    
    
    def __str__(self) -> str:
        return self.title

    
class Blog_comments(models.Model):
    description = models.TextField()
    comment_post_date = models.DateTimeField(auto_now=True)
    blog_post = models.ForeignKey(Blog_posts,on_delete = models.CASCADE)
    user = models.ForeignKey(Bloggers,on_delete = models.CASCADE)
    
    
    def __str__(self):
        return self.description