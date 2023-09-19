import os
import socketpool
import wifi
# import time
import microcontroller
from pm25 import readData
from adafruit_httpserver import Server, Request, Response, FileResponse, JSONResponse

ssid = os.getenv("WIFI_SSID")
password = os.getenv("WIFI_PASSWORD")

print("Connecting to", ssid)
wifi.radio.connect(ssid, password)
print("Connected to", ssid)

pool = socketpool.SocketPool(wifi.radio)
server = Server(pool, "/static", debug=True)


def c2f(cel):
    return (cel * 9/5) + 32


@server.route("/")
def base(request: Request):
    return FileResponse(request, "index.html", "/static")


@server.route("/data.json")
def cpu_information_handler(request: Request):
    sensorData = readData()
    data = {
        "cpuTemp0": c2f(microcontroller.cpus[0].temperature),
        "cpuTemp1": c2f(microcontroller.cpus[1].temperature),
    }
    data.update(sensorData)
    return JSONResponse(request, data)


server.serve_forever(str(wifi.radio.ipv4_address))
