from django.http import JsonResponse
from django.utils import timezone
from datetime import datetime
import pytz



def SendResponse(status=200,data={}):
    return JsonResponse(data,status=status)
    
def getCustomtimesince(value):
    now = timezone.now()
    delta = now - value
    
    
    hours, remainder = divmod(delta.seconds, 3600)
    minutes, _ = divmod(remainder, 60)

    if delta.days > 0:
        return f"{delta.days} days ago"
    elif hours > 0:
        return f"{hours} {'hour' if hours == 1 else 'hours'} ago"
    elif minutes > 0:
        return f"{minutes} {'minute' if minutes == 1 else 'minutes'} ago"
    else:
        return 'now'
    
    
    


def convert_utc_to_ist(utc_datetime_str, input_format='%b %d, %Y %I:%M %p'):
    utc_datetime = datetime.strptime(utc_datetime_str, input_format)

    utc_timezone = pytz.utc
    ist_timezone = pytz.timezone('Asia/Kolkata') 

    utc_datetime = utc_timezone.localize(utc_datetime)
    ist_datetime = utc_datetime.astimezone(ist_timezone)
    
    ist_date = ist_datetime.strftime('%b %d, %Y')
    ist_time = ist_datetime.strftime('%I:%M %p')

    return ist_date,ist_time




def date_time_format(post_date):
    blog_post_date = post_date.strftime("%b %d, %Y")
    blog_post_time = post_date.strftime("%I:%M %p")
    combined_string = f'{blog_post_date} {blog_post_time}'
    
    
    return combined_string