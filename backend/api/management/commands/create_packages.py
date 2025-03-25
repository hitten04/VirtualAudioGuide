from django.core.management.base import BaseCommand
from api.models import Package, Place
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Create sample tour packages'

    def handle(self, *args, **kwargs):
        # Only proceed if we have places in the database
        if Place.objects.count() == 0:
            self.stdout.write(self.style.ERROR('No places found in the database. Please add places first.'))
            return
            
        # Get all available places
        places = list(Place.objects.all())
        self.stdout.write(f"Found {len(places)} places in the database")
        
        # Delete any existing packages
        Package.objects.all().delete()
        
        # Create package 1: Gujarat Heritage Tour
        package1 = Package.objects.create(
            name="Gujarat Heritage Tour",
            description="Explore the rich cultural heritage of Gujarat with this 3-day tour of the most iconic historical sites. Visit ancient temples, palaces, and monuments while experiencing the unique traditions and cuisine of the region.",
            price=Decimal('7999.00'),
            duration="3 days, 2 nights",
            discount=Decimal('10.00'),
        )
        
        # Add places to package 1 (take 3 places, or fewer if we don't have enough)
        needed_places = min(3, len(places))
        places_for_package1 = random.sample(places, needed_places) if len(places) > needed_places else places
        for place in places_for_package1:
            package1.places.add(place)
            
        self.stdout.write(self.style.SUCCESS(f'Created package: {package1.name} with {package1.places.count()} places'))
        
        # Create package 2: Spiritual Gujarat Tour
        package2 = Package.objects.create(
            name="Spiritual Gujarat Tour",
            description="Experience the spiritual side of Gujarat with visits to sacred temples and ashrams. This 5-day tour takes you on a journey of self-discovery while exploring the religious heritage of the state. Perfect for those seeking peace and enlightenment.",
            price=Decimal('12999.00'),
            duration="5 days, 4 nights",
            discount=Decimal('15.00'),
        )
        
        # Add places to package 2 (ensure we include at least 3 places)
        needed_places = min(3, len(places))
        # Use different places if possible, otherwise reuse
        places_for_package2 = []
        if len(places) > (needed_places * 2):
            # We have enough unique places for both packages
            remaining_places = [p for p in places if p not in places_for_package1]
            places_for_package2 = random.sample(remaining_places, needed_places)
        else:
            # Not enough unique places, reuse some
            places_for_package2 = random.sample(places, needed_places)
        
        for place in places_for_package2:
            package2.places.add(place)
            
        self.stdout.write(self.style.SUCCESS(f'Created package: {package2.name} with {package2.places.count()} places'))
        
        # Create package 3: Gujarat Adventure Tour
        package3 = Package.objects.create(
            name="Gujarat Adventure Tour",
            description="Embark on an exciting adventure across Gujarat, exploring its diverse landscapes from the Rann of Kutch to the beaches of Diu. This comprehensive 7-day tour offers a perfect mix of adventure, culture, and relaxation.",
            price=Decimal('19999.00'),
            duration="7 days, 6 nights",
            discount=Decimal('5.00'),
        )
        
        # Add places to package 3 (ensure we include at least 3 places)
        needed_places = min(3, len(places))
        # Use random selection of places
        places_for_package3 = random.sample(places, needed_places)
        
        for place in places_for_package3:
            package3.places.add(place)
            
        self.stdout.write(self.style.SUCCESS(f'Created package: {package3.name} with {package3.places.count()} places'))
        
        self.stdout.write(self.style.SUCCESS('Successfully created 3 tour packages')) 