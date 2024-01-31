from django.shortcuts import render,redirect
from django.http import HttpResponse
from blog_app.models import BlogPost,Blogger
from django.core.paginator import Paginator
from django.contrib.auth.models import User,Group
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages



@login_required(login_url="/blog-app/login")
def IndexPage(request):
    data = {
        'title':'django-blog-app-home'
    }
    return render(request,'index.html',data)


@login_required(login_url="/blog-app/login")
def All_blogs_page(request):
    blog_data = BlogPost.objects.all().order_by('-post_date')
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


@login_required(login_url="/blog-app/login")
def blog_detail_page(request,blogId):
    print('----------------------------------',request)
    blog_data = BlogPost.objects.get(id = blogId)
    data={
        'blog_data':blog_data
    }
    return render(request,'blog_detail.html',data)


@login_required(login_url="/blog-app/login")
def All_bloggers_page(request):
    blogger_data = Blogger.objects.all()
    
    
    data = {
        'title':'django-blog-app-all_bloggers',
        'blogger_data':blogger_data
    }
    return render(request,'all_bloggers.html',data)


@login_required(login_url="/blog-app/login")
def blogger_detail_page(request,bloggerId):
    blogger_data = Blogger.objects.get(id = bloggerId)
    blog_data = BlogPost.objects.filter(author = bloggerId).order_by('-post_date')
    print("-------------------------blog-data-----------------------",blog_data[2].title)
    data = {
        'blogger_data':blogger_data,
        'blog_data':blog_data
    }
    return render(request,'blogger_detail.html',data)
    


def Login_page(request):
    if request.method == 'POST':
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
                  
    return render(request,'login.html')



def Register_page(request):
    
    if request.method == 'POST':
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
        
        
        Blogger.objects.create(user=user,bio=user_bio)
        
        messages.success(request, "Account Created Successfully",extra_tags='success')
        return redirect('/blog-app/register')
    
    

    return render(request,'register.html')




def Logout_page(request):
    logout(request)
    return redirect('/blog-app/login')