import base64
import logging
import xml.etree.cElementTree as cElementTree
from datetime import datetime
from typing import List
from xml.etree.ElementTree import ParseError

from librus_client.model.messages import Message, Receiver


class MessageParser:
    __logger = logging.getLogger(__name__)
    __response = None

    def __init__(self, response: dict):
        self.__response = response

    def extract_message(self) -> Message:
        message: str = self.parse_with_lxml(base64.b64decode(self.__response['Message']))
        topic: str = self.__response['topic']
        message_id: str = self.__response['messageId']
        sender: str = self.__response['senderName']
        send_date = datetime.fromisoformat(self.__response['sendDate'])
        receivers: List[Receiver] = self.parse_receivers(self.__response['receivers'])
        return Message(message_id, send_date, topic, message, sender, receivers)

    @staticmethod
    def parse_with_lxml(xml: bytes) -> str:
        try: 
            root = cElementTree.fromstring(xml)
            return root[0].text
        except ParseError as e:
            return xml.decode('UTF-8')

    @staticmethod
    def parse_receivers(receivers: List[dict]) -> List[Receiver]:
        return [Receiver(r['firstName'], r['lastName'], r['group'], r['active'], r['pupilFirstName'], r['pupilLastName'], r['isBcc'], r['isCc']) for r in receivers]
