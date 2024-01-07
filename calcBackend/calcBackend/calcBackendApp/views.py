from django.http import JsonResponse
from datetime import date, timedelta
import requests
import os

def load_env_files(start_dir):
    current_dir = os.path.abspath(start_dir)

    while current_dir != '/':  # Stop when reaching the root directory
        env_file_path = os.path.join(current_dir, '.env')
        
        if os.path.exists(env_file_path):
            with open(env_file_path, 'r') as file:
                lines = file.readlines()
                for line in lines:
                    key, value = line.strip().split('=')
                    os.environ[key] = value
            return

        current_dir = os.path.dirname(current_dir)

    print("Error: No .env file found in parent directories.")

# Use the directory of the current script or Django project
load_env_files(os.path.dirname(__file__))

api_key = os.environ.get("SECRET_KEY")
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
        dividendFrequency = dividend.get('frequency', 'no information available sir')
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
