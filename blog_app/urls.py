from django.urls import path,include
from blog_app import views 

urlpatterns = [
    path('', views.IndexPage,name='home'),
    path('blog/all', views.All_blogs_page,name='blog-all'),
    path('blog/bloggers', views.All_bloggers_page,name='blog-bloggers'),
    path('blogdetail/<blogId>', views.blog_detail_page,name='blog-detail'),
]
