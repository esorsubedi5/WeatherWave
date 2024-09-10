from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
import requests

@api_view(['GET'])
def weather_data_api(request):
    city = request.GET.get('city', 'Sydney')
    api_key = settings.OPENWEATHERMAP_API_KEY
    url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        forecast_data = data['list'][:10*8:8]  
        result = {
            'city': data['city']['name'],
            'country': data['city']['country'],
            'forecast': [
                {
                    'date': item['dt_txt'],
                    'temp': item['main']['temp'],
                    'feels_like': item['main']['feels_like'],
                    'humidity': item['main']['humidity'],
                    'condition': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon']
                } for item in forecast_data
            ]
        }
        return Response(result)
    else:
        return Response({'error': 'Could not fetch weather data'}, status=response.status_code)
