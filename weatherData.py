from adafruit_bme280 import basic as adafruit_bme280
import busio
import board

i2c = busio.I2C(board.GP3, board.GP2)  # SCL, SDA

sensor = adafruit_bme280.Adafruit_BME280_I2C(i2c, address=0x76)
sensor.sea_level_pressure = 982

# def readSensor():
# altitude = sensor.altitude * 3.281;
# fahrenheit = (sensor.temperature * 9 / 5) + 32#

# print("\nTemperature: %0.1f C" % fahrenheit)
# print("Humidity: %0.1f %%" % sensor.relative_humidity)
# print("Pressure: %0.1f hPa" % sensor.pressure)
# print("Altitude = %0.2f feet" % altitude)
def readWeather():
    return sensor

    