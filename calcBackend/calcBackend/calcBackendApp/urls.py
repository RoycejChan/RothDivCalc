from django.urls import path
from .views import get_stock_dividend_data

urlpatterns = [
    path('api/get_stock_dividend_data/', get_stock_dividend_data, name='get_stock_dividend_data'),
]