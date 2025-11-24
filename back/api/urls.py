from django.urls import path

from . import views

urlpatterns = [
    path("consultar", views.get_data),
]