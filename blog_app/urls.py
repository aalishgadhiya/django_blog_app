from django.urls import path,include
from blog_app import views 

urlpatterns = [
    path('', views.IndexPage,name='home'),
    path('blog/all', views.All_blogs_page,name='blog-all'),
    path('blog/bloggers', views.All_bloggers_page,name='blog-bloggers'),
    path('blogdetail/<blogId>', views.blog_detail_page,name='blog-detail'),
    path('blog-app/login', views.Login_page,name='login'),
    path('blog-app/register', views.Register_page,name='register'),
    path('blog-app/logout', views.Logout_page,name='logout'),
    path('bloggerdetail/<bloggerId>', views.blogger_detail_page,name='blogger-detail'),
]
