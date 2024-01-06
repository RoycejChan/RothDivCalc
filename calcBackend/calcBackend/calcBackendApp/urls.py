from django.urls import path
from .views import get_stock_dividend_data

urlpatterns = [
    path('', get_stock_dividend_data, name='get_stock_dividend_data'),
]