# Generated by Django 5.0.1 on 2024-01-31 09:32

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog_app', '0004_blogcomment'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='BlogComment',
            new_name='Blog_comments',
        ),
        migrations.RenameModel(
            old_name='BlogPost',
            new_name='Blog_posts',
        ),
        migrations.RenameModel(
            old_name='Blogger',
            new_name='Bloggers',
        ),
    ]
