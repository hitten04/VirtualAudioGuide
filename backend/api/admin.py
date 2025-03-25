from django.contrib import admin
from .models import Place, Package, UserProfile, Booking, AudioGuide

class AudioGuideInline(admin.TabularInline):
    model = AudioGuide
    extra = 1

@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'created_at')
    search_fields = ('name', 'location', 'description')
    list_filter = ('created_at',)
    inlines = [AudioGuideInline]

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration')
    search_fields = ('name', 'description')
    filter_horizontal = ('places',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone')
    search_fields = ('user__username', 'user__email', 'phone')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'package', 'booking_date', 'travel_date', 'status', 'total_price')
    list_filter = ('status', 'booking_date', 'travel_date')
    search_fields = ('user__username', 'package__name')

@admin.register(AudioGuide)
class AudioGuideAdmin(admin.ModelAdmin):
    list_display = ('place', 'language', 'created_at')
    list_filter = ('language',)
    search_fields = ('place__name',)
