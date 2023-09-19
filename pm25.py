import time
import board
import busio
from adafruit_pm25.uart import PM25_UART

reset_pin = None
uart = busio.UART(board.GP0, board.GP1, baudrate=9600)
pm25 = PM25_UART(uart, reset_pin)

def readData():
    try:
        aqdata = pm25.read()
    except RuntimeError:
        print("Unable to read from sensor, retrying...")
        # continue
    return aqdata

# {
#   "pm10 env": 34,
#   "pm100 env": 64,
#   "particles 03um": 8136,
#   "particles 10um": 498,
#   "pm10 standard": 49,
#   "pm25 env": 52,
#   "particles 05um": 2394,
#   "particles 25um": 28,
#   "particles 100um": 0,
#   "particles 50um": 4
# }
