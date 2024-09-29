from librus_client.parsers.timetable import TimetableParser


class TestTimeTable:
    __file: str = open("tests/resources/timetable.html", "r").read()
    __parser: TimetableParser = TimetableParser(__file)

    def test_should_parse_request_key(self):
        hidden_fields = self.__parser.extract_hidden_fields()
        assert hidden_fields['requestkey'] == '068f72ec-958d-40ff-83a5-8485c129345b'

    def test_should_parse_timetable(self):
        timetable = self.__parser.extract_timetable()
        assert len(timetable) == 95
