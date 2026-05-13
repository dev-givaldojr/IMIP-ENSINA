import pika
import json
import os
import time
import urllib.request
from openai import OpenAI

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://imip_admin:imip_password@rabbitmq:5672/")
API_GATEWAY_URL = os.getenv("API_GATEWAY_URL", "http://api-gateway:8080")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "placeholder")

# Ensure API key is set
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_content(patient_id, theme, difficulty):
    if OPENAI_API_KEY == "placeholder" or not OPENAI_API_KEY:
        return "Era uma vez uma aventura incrível. (Configure sua OPENAI_API_KEY para gerar histórias reais!)"
        
    try:
        # Prompt GPT-4o-mini to generate a short story
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Você é um assistente criativo focado em alfabetização infantil para crianças internadas em um hospital. Escreva histórias muito curtas (máximo 3 parágrafos) e lúdicas."},
                {"role": "user", "content": f"Crie uma história para uma criança nível {difficulty} sobre o tema {theme}."}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating content: {e}")
        return "Era uma vez uma aventura incrível, mas a magia falhou desta vez."

def process_message(ch, method, properties, body):
    payload = json.loads(body)
    print(f"Received request to generate media for task: {payload.get('taskId')}")
    
    patient_id = payload.get('patientId')
    theme = payload.get('theme', 'aventura')
    difficulty = payload.get('difficulty', 1)
    
    # 1. Generate text
    story = generate_content(patient_id, theme, difficulty)
    print(f"Story generated for {patient_id}")
    
    # 2. Notify API Gateway to forward WebSocket event
    notify_payload = json.dumps({
        "patientId": patient_id,
        "type": "MEDIA_GENERATED",
        "data": {
            "theme": theme,
            "story": story
        }
    }).encode('utf-8')
    
    try:
        req = urllib.request.Request(f"{API_GATEWAY_URL}/internal/notify", data=notify_payload, headers={'Content-Type': 'application/json'})
        urllib.request.urlopen(req)
        print("Notified API Gateway")
    except Exception as e:
        print(f"Failed to notify gateway: {e}")
    
    ch.basic_ack(delivery_tag=method.delivery_tag)

def start_worker():
    while True:
        try:
            params = pika.URLParameters(RABBITMQ_URL)
            connection = pika.BlockingConnection(params)
            channel = connection.channel()
            channel.queue_declare(queue='generate_media', durable=True)
            
            print("Worker connected to RabbitMQ. Waiting for messages.")
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue='generate_media', on_message_callback=process_message)
            channel.start_consuming()
        except Exception as e:
            print(f"RabbitMQ Connection failed: {e}. Retrying in 5s...")
            time.sleep(5)
