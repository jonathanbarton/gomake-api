from random import choice,randint,uniform
from urllib import urlencode

class Sensors():
	"""
		latitude=42.3347161667&longitude=-72.6807305&altitude=00077&satellites=10&fix_quality=2&Sound=247&Barometer=338.73&Temperature=-22.20
	"""
	def __init__(self,coords=[]):
		self.start_latitude = '42.3347161667'
		self.start_longitude = '-72.6807305'
		self.start_altitude = '00077'
		if(len(coords) > 0):
			self.coords = coords
	def get_hex_string(self):
		sensor_data = {
			'latitude': self.get_latitude(),
			'longitude': self.get_longitude(),
			'altitude': self.get_altitude(),
			'satellites': self.get_satellites(),
			'fix_quality': self.get_fix_quality(),
			'Sound': self.get_sound(),
			'Barometer': self.get_barometer(),
			'Temperature': self.get_temperature()
		}
		data_string = urlencode(sensor_data)
		return self.to_hex(data_string)
	def get_latitude(self):
		if(len(self.coords) > 0):
			return str(choice(self.coords)[0])
		return self.start_latitude
	def get_longitude(self):
		if(len(self.coords) > 0):
			return str(choice(self.coords)[1])
		return self.start_longitude
	def get_altitude(self):
		if(len(self.coords) > 0):
			return str(choice(self.coords)[2])
		return self.start_altitude
	def get_satellites(self):
		return str(randint(0,13))
	def get_fix_quality(self):
		return str(randint(0,4))
	def get_temperature(self):
		return ("%.2f" % uniform(-45,30))
	def get_barometer(self):
		return ("%.2f" % uniform(100,500))
	def get_sound(self):
		return str(randint(0,500))
	def to_hex(self,data_string):
		return  "".join([hex(ord(c))[2:].zfill(2) for c in data_string])