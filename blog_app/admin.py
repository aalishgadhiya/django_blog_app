from typing import Any
from django.contrib import admin
from django.http.request import HttpRequest
from blog_app.models import Blog_posts,Bloggers,Blog_comments



class BlogAdmin(admin.ModelAdmin):
    list_display =('id','title','content','post_date','author')
    readonly_fields = ['author']
    
    def get_readonly_fields(self, request , obj=None):
        if request.user.is_superuser:
            return []
        return ['author']
    
    def save_model(self, request, obj, form, change):
        if not obj.author:
            if request.user.is_authenticated:  
                blogger_instance = Bloggers.objects.get(user=request.user)
                obj.author = blogger_instance
                print('---------------------request.user------------------',request.user)
                print('-----------------------blogger_instance----------------',blogger_instance)

        obj.save()



class BloggerAdmin(admin.ModelAdmin):
    list_display=('id','user','bio')    
    
    
    
class BlogCommentAdmin(admin.ModelAdmin):
    list_display=('id','description','comment_post_date','blog_post','user')    
    
admin.site.register(Blog_posts,BlogAdmin)
admin.site.register(Bloggers,BloggerAdmin)
admin.site.register(Blog_comments,BlogCommentAdmin)

# Register your models here.
