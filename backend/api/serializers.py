from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Place, Package, UserProfile, Booking, AudioGuide

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('id', 'user', 'phone', 'address', 'profile_picture')

class AudioGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioGuide
        fields = ['id', 'language', 'audio_file']

class PlaceSerializer(serializers.ModelSerializer):
    audio_guides = AudioGuideSerializer(many=True, read_only=True)
    
    class Meta:
        model = Place
        fields = ['id', 'name', 'description', 'location', 'image', 'audio_guides', 'created_at', 'updated_at']
        
class PlaceListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing places"""
    class Meta:
        model = Place
        fields = ('id', 'name', 'location', 'image', 'description')

class PackageSerializer(serializers.ModelSerializer):
    places = PlaceListSerializer(many=True, read_only=True)
    
    class Meta:
        model = Package
        fields = '__all__'
        
class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    package = PackageSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        
class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('package', 'travel_date', 'number_of_people', 'total_price')
        
    def create(self, validated_data):
        # Associate the current user with the booking
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm', 'first_name', 'last_name')
        
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
        
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user 