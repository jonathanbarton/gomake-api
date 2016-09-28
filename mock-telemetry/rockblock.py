import math
from random import randint, random, choice
from time import sleep
from datetime import datetime
import csv
import requests


class RockBlock():
	"""
	Example Message:
		imei: 300234063771850
		momsn: 130
		transmit_time: 2016-08-20T16:16:22Z UTC
		iridium_latitude: 42.3530
		iridium_longitude: -72.6865
		iridium_cep: 4.0
		data: 6c617469747564653d34322e33333437313035266c6f6e6769747564653d2d37322e3638303731393833333326616c7469747564653d303030373826736174656c6c697465733d3130266669785f7175616c6974793d3226536f756e643d313337264261726f6d657465723d313030312e34362654656d70657261747572653d34312e3030
	"""
	def __init__(self):
		self.coords = []
		self.imei = None
		self.momsn = None
		self.import_coordinates_list()
	def send_message(self):
		payload = self.get_message()
		print payload
		r = requests.post(url, data=payload)
	def get_message(self):
		message = {
			'imei':self.get_imei(),
			'momsn': self.get_momsn(),
			'transmit_time': self.get_transmit_time(),
			'iridium_latitude': self.get_iridium_latitude(),
			'iridium_longitude': self.get_iridium_longitude(),
			'iridium_cep': self.get_iridium_cep(),
			'data': self.get_data()
		}
		return message
	def get_imei(self):
		if(not self.imei):
			self.imei = self.get_random_digits(15)
		return self.imei
	def get_momsn(self):
		if(not self.momsn):
			self.momsn = self.get_random_digits(3)
		else:
			self.momsn += 1
		return self.momsn
	def get_transmit_time(self):
		return datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ UTC')
	def get_iridium_latitude(self):
		if(len(self.coords) > 0):
			return choice(self.coords)[0]
		else:
			return self.get_random_iridium_latitude()
	def get_iridium_longitude(self):
		if(len(self.coords) > 0):
			return choice(self.coords)[1]
		else:
			return self.get_random_iridium_longitude()
	def get_random_iridium_latitude(self):
		num = random() * 180
		pos = math.floor(random())
		if(pos == 0):
			num *= -1
		return ("%.3f" % num)
	def get_random_iridium_longitude(self):
		num = random() * 90
		pos = math.floor(random())
		if(pos == 0):
			num *= -1
		return ("%.3f" % num)
	def get_iridium_cep(self):
		return "4.0"
	def get_data(self):
		return "6c617469747564653d34322e33333437313035266c6f6e6769747564653d2d37322e3638303731393833333326616c7469747564653d303030373826736174656c6c697465733d3130266669785f7175616c6974793d3226536f756e643d313337264261726f6d657465723d313030312e34362654656d70657261747572653d34312e3030"
	def get_random_digits(self, digits):
		lower_bound = 10 ** (digits - 1)
		upper_bound = (10 ** digits) - 1
		return randint(lower_bound, upper_bound)
	def import_coordinates_list(self, filepath='flightcoordinates.csv'):
		self.coords = []
		with open(filepath, 'rb') as csvfile:
			coordinate_reader = csv.reader(csvfile, delimiter=',', quotechar='|')
			for coordinate in coordinate_reader:
				coordinate_tuple = (coordinate[0], coordinate[1])
				self.coords.append(coordinate_tuple)

if __name__ == "__main__":
	rockblock = RockBlock()
	while(True):
		rockblock.send_message()
		sleep(10)