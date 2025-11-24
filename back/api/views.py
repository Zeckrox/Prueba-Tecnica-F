from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
import requests
import json
# Create your views here.
@api_view(['POST'])
def get_data(request):
    body = json.loads(request.body)
    BASE_URL = "https://mi-api-banco-843945314233.us-central1.run.app"
    API_KEY = body.get('api_key') 
    ACCOUNT_ID = body.get('account_id')
    headers = {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
    }
    try:
        url_balance = f"{BASE_URL}/api/accounts/{ACCOUNT_ID}/balance"
        url_movements = f"{BASE_URL}/api/accounts/{ACCOUNT_ID}/movements"
        response_balance = requests.get(url_balance, headers=headers)
        response_movements = requests.get(url_movements, headers=headers)
        if response_movements.status_code == 401 or response_balance.status_code == 401:
            return Response(
                {"error": "La API Key rechazada por el banco"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        if response_movements.status_code == 200: 
            data_movements = response_movements.json()
        else: print(f"Error en Movimientos: {response_movements.status_code} - {response_movements.text}")
        if response_balance.status_code == 200: 
            data_balance = response_balance.json()
        else: print(f"Error en Balance: {response_balance.status_code} - {response_balance.text}")

        movimientos = data_movements.get('movements')
        cantidad = len(movimientos)
        suma = 0
        for mov in movimientos: suma += mov.get('amount')

        #Verificación de balance:
        if not(data_balance.get('balance') == round(suma,2)):
            print(f"Error: Balance no es igual a suma de movimientos, diferencia: ${abs(round(suma,2)-data_balance.get('balance'))}")

        return Response({
            "balance": data_balance.get('balance'),
            "movements": movimientos,
            "total_movements": cantidad
        })
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")