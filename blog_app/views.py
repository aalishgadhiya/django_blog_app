from django.shortcuts import render
from django.http import HttpResponse
from blog_app.models import BlogPost
from django.core.paginator import Paginator

def IndexPage(request):
    data = {
        'title':'django-blog-app-home'
    }
    return render(request,'index.html',data)



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



def blog_detail_page(request,blogId):
    print('----------------------------------',request)
    blog_data = BlogPost.objects.get(id = blogId)
    data={
        'blog_data':blog_data
    }
    return HttpResponse(blogId)
    # return render(request,'blog_detail.html',data)


def All_bloggers_page(request):
    data = {
        'title':'django-blog-app-all_bloggers'
    }
    return render(request,'all_bloggers.html',data)
