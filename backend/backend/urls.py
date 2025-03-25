from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

# Create a direct media serving view
def media_serve(request, path):
    response = serve(request, path, document_root=settings.MEDIA_ROOT)
    # Set MIME types for audio files
    if path.endswith('.mp3'):
        response['Content-Type'] = 'audio/mpeg'
    return response

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # Direct media serving with fixed MIME types
    re_path(r'^media/(?P<path>.*)$', media_serve),
]

# Add this for development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 