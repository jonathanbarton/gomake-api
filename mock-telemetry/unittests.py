import unittest
from rockblock  import RockBlock

class TestRockBlock(unittest.TestCase):
	def setUp(self):
		self.rockblock = RockBlock()
	def test_get_message_has_valid_message_headers(self):
		message = self.rockblock.get_message()
		self.assertEqual(len(str(message['momsn'])),3)
		self.assertEqual(len(str(message['imei'])),15)
		self.assertTrue('iridium_cep' in message)
		self.assertTrue('iridium_latitude' in message)
		self.assertTrue('iridium_longitude' in message)
		self.assertTrue('transmit_time' in message)

if __name__ == '__main__':
	unittest.main()