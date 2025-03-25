from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'places', views.PlaceViewSet)
router.register(r'packages', views.PackageViewSet)
router.register(r'bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.UserRegistrationView.as_view(), name='user-registration'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('featured-places/', views.featured_places, name='featured-places'),
    path('featured-packages/', views.featured_packages, name='featured-packages'),
] 