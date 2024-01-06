from django.http import JsonResponse
from datetime import date, timedelta
import requests
from dotenv import load_dotenv
import os

# Load .env file from two levels up
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path)
# Load environment variables from the .env file

api_key = os.getenv("API_KEY")

def get_stock_dividend_data(request):

    today = date.today()
    # Calculate yesterday's date
    yesterday = today - timedelta(days=1)
    formatted_yesterday = yesterday.strftime("%Y-%m-%d")

    tickerSymbol = request.GET.get('ticker')

# TO GET THE TICKER'S MOST RECENT CLOSE PRICE OF THE PREVIOUS DAY
    priceUrl = f'https://api.polygon.io/v1/open-close/{tickerSymbol}/{formatted_yesterday}?adjusted=true&apiKey={api_key}'

    priceR = requests.get(priceUrl)
    priceData = priceR.json()
    tickerPrice = priceData.get('close', 0.0)
# TO GET TICKER's FULL COMPANY NAME
    tickerUrl = f'https://api.polygon.io/v3/reference/tickers/{tickerSymbol}?apiKey={api_key}'

    tickerR = requests.get(tickerUrl)
    tickerJson = tickerR.json()

    if 'results' in tickerJson and tickerJson['results']:
        result = tickerJson['results']  
        description = result.get('description', 'No description available') 
        logo_url = result['branding'].get('logo_url', 'No logo URL available')  
        name = result.get('name', 'No name available')  

    else:
        description = 'No data available'
        logo_url = 'No logo URL available'
        name = 'No name available'

    tickerData = {
        'name': name,
        'description': description,
        'logo': logo_url
    }


# TO GET THE TICKER'S DIVIDEND STATS
    divUrl = f'https://api.polygon.io/v3/reference/dividends?ticker={tickerSymbol}&apiKey={api_key}'

    divR = requests.get(divUrl)
    divData = divR.json()

    divResults = divData.get('results', []) 
    if divResults:
        dividend = divResults[0]
        dividendFrequency = dividend.get('frequency', 'no information available')
        dividendPayout = dividend.get('cash_amount', "no information available")

        divData = {
            'divFrequency': dividendFrequency,
            'divPayout': dividendPayout,
        }
    else:
        print('No dividend information available.')

    stockStats = {
        'price': tickerPrice,
        'details': tickerData,
        'dividend': divData
    }



    return JsonResponse(stockStats, safe=False)
