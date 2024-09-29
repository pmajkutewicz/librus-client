import json

from librus_client.parsers.messages import MessageParser


class TestNotices:
    __file: str = open("tests/resources/message.json", "r").read()
    __parser: MessageParser = MessageParser(json.loads(__file)['data'])

    def test_should_parse_messages(self):
        message = self.__parser.extract_message()
        assert message.message_id == '3' 
