import os
import socketpool
import wifi
import mdns
# import time
import microcontroller
from adafruit_httpserver import Server, Request, FileResponse, JSONResponse
from pm25 import readData
from weatherData import readWeather
from showGpio import showPins

ssid = os.getenv("WIFI_SSID")
password = os.getenv("WIFI_PASSWORD")

mdns_server = mdns.Server(wifi.radio)
mdns_server.hostname = "weather-station"
mdns_server.advertise_service(service_type="_http", protocol="_tcp", port=5000)

print("Connecting to", ssid)
wifi.radio.connect(ssid, password)
print("Connected to", ssid)
print(wifi.radio.ipv4_address)
pool = socketpool.SocketPool(wifi.radio)
server = Server(pool, "/static", debug=False)

def c2f(cel):
    return (cel * 9/5) + 32

def m2f(meters):
    return meters * 3.281;

@server.route("/")
def base(request: Request):
    return FileResponse(request, "index.html", "/static")


@server.route("/data.json")
def cpu_information_handler(request: Request):
    sensorData = readData()
    weatherData = readWeather()
    
    data = {
        "cpuTemp0": c2f(microcontroller.cpus[0].temperature),
        "cpuTemp1": c2f(microcontroller.cpus[1].temperature),
        "temperature": c2f(weatherData.temperature),
        "humidity": weatherData.relative_humidity,
        "pressure": weatherData.pressure,
        "altitude": m2f(weatherData.altitude)
    }
    data.update(sensorData)
    return JSONResponse(request, data)


server.serve_forever(str(wifi.radio.ipv4_address))
