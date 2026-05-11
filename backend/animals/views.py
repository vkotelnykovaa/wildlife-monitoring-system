from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated

from .models import Animal, GPSData, Adoption
from .serializers import AnimalSerializer, GPSDataSerializer, AdoptionSerializer
from datetime import timedelta
from django.utils import timezone
import math


class AnimalListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        animals = Animal.objects.all()
        serializer = AnimalSerializer(animals, many=True)
        return Response(serializer.data)

class AnimalDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        animal = Animal.objects.get(id=id)
        serializer = AnimalSerializer(animal)
        return Response(serializer.data)

class AnimalGPSView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, animal_id):
        gps_data = GPSData.objects.filter(animal_id=animal_id).order_by("timestamp")

        user = request.user

        if user.role == "client":
            one_month_ago = timezone.now() - timedelta(days=30)
            gps_data = gps_data.filter(timestamp__gte=one_month_ago)

        elif user.role == "researcher":
            date_from = request.GET.get("date_from")
            date_to = request.GET.get("date_to")

            if date_from:
                gps_data = gps_data.filter(timestamp__date__gte=date_from)

            if date_to:
                gps_data = gps_data.filter(timestamp__date__lte=date_to)

        elif user.role == "admin" or user.is_staff:
            pass

        else:
            return Response(
                {"detail": "Недостатньо прав для перегляду GPS-даних."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = GPSDataSerializer(gps_data, many=True)
        return Response(serializer.data)

class GPSDataCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = GPSDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdoptionCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AdoptionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AnimalActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, animal_id):
        gps_data = GPSData.objects.filter(
            animal_id=animal_id
        ).order_by("timestamp")

        user = request.user

        if user.role == "client":
            one_month_ago = timezone.now() - timedelta(days=30)
            gps_data = gps_data.filter(timestamp__gte=one_month_ago)

        elif user.role == "researcher":
            date_from = request.GET.get("date_from")
            date_to = request.GET.get("date_to")

            if date_from:
                gps_data = gps_data.filter(timestamp__date__gte=date_from)

            if date_to:
                gps_data = gps_data.filter(timestamp__date__lte=date_to)

        elif user.role == "admin" or user.is_staff:
            pass

        else:
            return Response(
                {"detail": "Недостатньо прав для аналізу активності."},
                status=status.HTTP_403_FORBIDDEN
            )

        points = list(gps_data)

        def haversine(lat1, lon1, lat2, lon2):
            radius = 6371

            d_lat = math.radians(lat2 - lat1)
            d_lon = math.radians(lon2 - lon1)

            a = (
                math.sin(d_lat / 2) ** 2
                + math.cos(math.radians(lat1))
                * math.cos(math.radians(lat2))
                * math.sin(d_lon / 2) ** 2
            )

            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

            return radius * c

        daily_distances = []

        for i in range(1, len(points)):
            prev = points[i - 1]
            current = points[i]

            distance = haversine(
                prev.latitude,
                prev.longitude,
                current.latitude,
                current.longitude,
            )

            daily_distances.append({
                "date": current.timestamp.date().isoformat(),
                "distance_km": round(distance, 2),
            })

        total_distance = sum(item["distance_km"] for item in daily_distances)
        observation_days = len(points)

        average_daily_distance = (
            total_distance / len(daily_distances)
            if daily_distances
            else 0
        )

        max_daily_distance = (
            max(item["distance_km"] for item in daily_distances)
            if daily_distances
            else 0
        )

        low_movement_days = len(
            [item for item in daily_distances if item["distance_km"] < 0.5]
        )

        if average_daily_distance < 0.5:
            activity_level = "низька"
        elif average_daily_distance < 2:
            activity_level = "середня"
        else:
            activity_level = "висока"

        return Response({
            "animal_id": animal_id,
            "points_count": len(points),
            "observation_days": observation_days,
            "total_distance_km": round(total_distance, 2),
            "average_daily_distance_km": round(average_daily_distance, 2),
            "max_daily_distance_km": round(max_daily_distance, 2),
            "low_movement_days": low_movement_days,
            "activity_level": activity_level,
            "daily_distances": daily_distances,
        })