from django import template
from django.template.defaultfilters import timesince
from utils import getCustomtimesince,convert_utc_to_ist,date_time_format

register = template.Library()

@register.filter
def custom_timesince(value):
   return getCustomtimesince(value)



@register.filter
def custom_timezone(value):
   ist_date,ist_time =  convert_utc_to_ist(value,input_format='%b %d, %Y %I:%M %p')
   return {'ist_date':ist_date,'ist_time':ist_time}


@register.filter
def custom_date_time_formate(value):
    return date_time_format(value)
 
 
 
@register.filter
def first_char(value):
   if value:
      return value[0]
   else:
      return '' 
   
   
@register.filter
def find_length(value):
   length = value
   return len(length)   
   