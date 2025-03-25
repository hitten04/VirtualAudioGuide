from django.shortcuts import render
from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Place, Package, UserProfile, Booking, AudioGuide
from .serializers import (
    PlaceSerializer, PackageSerializer, UserSerializer, UserProfileSerializer,
    BookingSerializer, BookingCreateSerializer, UserRegistrationSerializer,
    PlaceListSerializer
)
import random
import os
from django.http import FileResponse, HttpResponse
from django.conf import settings

# Create your views here.

class PlaceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Place.objects.all()
    permission_classes = [permissions.AllowAny]  # Allow any user to access places
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PlaceListSerializer
        return PlaceSerializer

class PackageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile

class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BookingCreateSerializer
        return BookingSerializer
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_places(request):
    """Get a list of featured places for the homepage"""
    places = Place.objects.all()
    if places.count() > 4:
        # Get 4 random places
        places = random.sample(list(places), 4)
    serializer = PlaceListSerializer(places, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def featured_packages(request):
    """Get a list of featured packages for the homepage"""
    packages = Package.objects.all()
    if packages.count() > 3:
        # Get 3 random packages
        packages = random.sample(list(packages), 3)
    serializer = PackageSerializer(packages, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def serve_audio_file(request, guide_id):
    """
    Directly serve an audio file by guide ID to avoid CORS issues
    Only authenticated users can access audio files
    """
    guide = get_object_or_404(AudioGuide, id=guide_id)
    file_path = os.path.join(settings.MEDIA_ROOT, str(guide.audio_file))
    
    if os.path.exists(file_path):
        response = FileResponse(open(file_path, 'rb'))
        
        # Set the content type based on file extension
        if file_path.endswith('.mp3'):
            response['Content-Type'] = 'audio/mpeg'
        elif file_path.endswith('.wav'):
            response['Content-Type'] = 'audio/wav'
        elif file_path.endswith('.ogg'):
            response['Content-Type'] = 'audio/ogg'
        else:
            response['Content-Type'] = 'audio/mpeg'  # Default to MP3
            
        response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"'
        return response
    else:
        return HttpResponse(f"File not found: {guide.audio_file}", status=404)
