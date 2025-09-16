from django.urls import path
from .views import (
                    RoomView, 
                    CreateRoomView, 
                    GetRoom,
                    JoinRoom,
                    UserRoom
                )

urlpatterns = [
    path('room/', RoomView.as_view()),
    path('create_room/', CreateRoomView.as_view()),
    path('room', GetRoom.as_view()),
    path('join_room/', JoinRoom.as_view()),
    path('user_room/', UserRoom.as_view())
]
