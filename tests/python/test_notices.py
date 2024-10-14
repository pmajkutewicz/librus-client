from librus_client.parsers.notices import NoticeParser


class TestNotices:
    __file: str = open("tests/resources/notices.html", "r").read()
    __parser: NoticeParser = NoticeParser(__file)

    def test_should_parse_timetable(self):
        timetable = self.__parser.extract_notices()
        assert len(timetable) == 4
