# Add this at the top if not already present
import os

# Add this to ensure DEBUG is True
DEBUG = True

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://50.19.134.205:3000",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # For development only
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
CORS_ALLOW_HEADERS = ['*']
CORS_EXPOSE_HEADERS = ['Content-Type', 'Content-Disposition', 'Accept']
CORS_PREFLIGHT_MAX_AGE = 86400  # 24 hours

# Media files (Images, Audio files)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Add proper file serving options
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]

# Content types
FILE_UPLOAD_PERMISSIONS = 0o644
FILE_UPLOAD_DIRECTORY_PERMISSIONS = 0o755

# Add proper MIME types for audio files
FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
    'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]

# Security settings for development
SECURE_CROSS_ORIGIN_OPENER_POLICY = None  # Disable COOP for development

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'api',
] 