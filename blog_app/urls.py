from django.urls import path,include
from .views import IndexPage , All_blog_page,blog_detail_page,All_bloggers_page,blogger_detail_page,Login_page,Register_page,Logout_page,CreateBlogView,AddCommentView
from blog_app import views

urlpatterns = [
    path('', IndexPage.as_view(),name='home'),
    path('blog/all', All_blog_page.as_view(),name='blog-all'),
    path('blog/create-blog', CreateBlogView.as_view(),name='create-blog'),
    path('blog/bloggers', All_bloggers_page.as_view(),name='blog-bloggers'),
    path('blogdetail/<blogId>', blog_detail_page.as_view(),name='blog-detail'),
    path('blogdetail/<blogId>/add-comment', AddCommentView.as_view(),name='add-comment'),
    path('blog-app/login', Login_page.as_view(),name='login'),
    path('blog-app/register', Register_page.as_view(),name='register'),
    path('blog-app/logout', Logout_page.as_view(),name='logout'),
    path('bloggerdetail/<bloggerId>', blogger_detail_page.as_view(),name='blogger-detail'),
]
