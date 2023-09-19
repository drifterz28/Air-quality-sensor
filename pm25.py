import board
import busio
from adafruit_pm25.uart import PM25_UART

reset_pin = None
uart = busio.UART(board.GP0, board.GP1, baudrate=9600)
pm25 = PM25_UART(uart, reset_pin)


def readData():
    aqdata = pm25.read()
    return aqdata
