from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from blog_app.models import Blog_posts,Bloggers,Blog_comments
from django.core.paginator import Paginator
from django.contrib.auth.models import User,Group
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib import messages
from django.views import View


@method_decorator(login_required(login_url='/blog-app/login'),name='dispatch')
class IndexPage(View):
    def get(self,request):
        data = {
            'title':'django-blog-app-home'
        }
        return render(request,'index.html',data)
            
 
@method_decorator(login_required(login_url='/blog-app/login'),name='dispatch')
class All_blog_page(View):
    def get(self,request):
        blog_data = Blog_posts.objects.all().order_by('-post_date')
        paginator = Paginator(blog_data,5)
        page_number = request.GET.get('page')
        FinalData = paginator.get_page(page_number)
        total_page = FinalData.paginator.num_pages
        
        data = {
            'title':'django-blog-app-all_blogs',
            'blog_data':FinalData,
            'total_page':[n+1 for n in range(total_page)]
        }
        return render(request,'all_blogs.html',data)
        


@method_decorator(login_required(login_url='/blog-app/login'),name='dispatch')
class blog_detail_page(View):
    def get(self,request,blogId):
        blog_data = Blog_posts.objects.get(id = blogId)
        comments = Blog_comments.objects.filter(blog_post=blog_data).order_by('-comment_post_date')
        data={
            'blog_data':blog_data,
            'comments':comments,
        }
        return render(request,'blog_detail.html',data)
    
    
    def post(self,request,blogId):
        print('12345-----------------',blogId)
        blog_data = Blog_posts.objects.get(id = blogId)
        comment_text = request.POST.get('user_comment')
        blogger_instance = Bloggers.objects.get(user=request.user)
        
        if comment_text:
            comment = Blog_comments.objects.create(
                description = comment_text,
                blog_post = blog_data,
                user = blogger_instance,
            )
            print(comment_text)
            # return redirect(f'/blogdetail/{blogId}')
            comment_date = comment.comment_post_date.strftime("%b,%d %Y")
            return JsonResponse({
                'success':True,
                'comment_text':comment_text,
                'user_name':blogger_instance.user.username,
                'comment_date':comment_date
                })
        
    
@method_decorator(login_required(login_url='/blog-app/login'),name='dispatch')
class All_bloggers_page(View):
    def get(self,request):
        blogger_data = Bloggers.objects.all()
        data = {
            'title':'django-blog-app-all_bloggers',
            'blogger_data':blogger_data
        }
        return render(request,'all_bloggers.html',data)
        
             


@method_decorator(login_required(login_url='/blog-app/login'),name='dispatch')
class blogger_detail_page(View):
    def get(self,request,bloggerId):
        blogger_data = Bloggers.objects.get(id = bloggerId)
        blog_data = Blog_posts.objects.filter(author = bloggerId).order_by('-post_date')
        # print("-------------------------blog-data-----------------------",blog_data[2].title)
        data = {
            'blogger_data':blogger_data,
            'blog_data':blog_data
        }
        return render(request,'blogger_detail.html',data)
         
         

class Login_page(View):
    def get(self,request):
         return render(request,'login.html')
     
     
    def post(self,request):
        user_name = request.POST.get('user_name')
        password = request.POST.get('password')
        
        if not User.objects.filter(username = user_name).exists():
            messages.error(request, "Invalid UserName",extra_tags='error')
            return redirect('/blog-app/login')
        
        
        user = authenticate(username=user_name , password=password)
        
        if user is None:
            messages.error(request, "Invalid Password",extra_tags='error')
            return redirect('/blog-app/login')
        
        else:
            login(request,user)
            return redirect('/')   
         
    


class Register_page(View):
    def get(self,request):
        return render(request,'register.html')
    
    def post(self,request):
         first_name = request.POST.get('first_name')
         last_name = request.POST.get('last_name')
         user_name = request.POST.get('user_name')
         password = request.POST.get('password')
         user_bio = request.POST.get('user_bio')
         print('------------------------------------------')
         print(first_name,last_name,user_name,password)
         
         user = User.objects.filter(username = user_name)
         
         if user.exists():
             messages.error(request, "UserName Already taken",extra_tags='error')
             return redirect('/blog-app/register')
         
         
         
         user = User.objects.create(
             first_name = first_name,
             last_name = last_name,
             username = user_name)
         
         user.set_password(password)
         
         
         
         group_name = 'bloggers'
         group = Group.objects.get(name=group_name)
         user.groups.add(group)
         
         user.is_staff = True
         user.save()
         
         
         Bloggers.objects.create(user=user,bio=user_bio)
         
         messages.success(request, "Account Created Successfully",extra_tags='success')
         return redirect('/blog-app/register')
        
        


class Logout_page(View):
    def get(self,request):
        logout(request)
        return redirect('/blog-app/login')
        
