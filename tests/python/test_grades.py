from librus_client.parsers.grades import GradeParser


class TestNotices:
    __file: str = open("tests/resources/grades.html", "r").read()
    __parser: GradeParser = GradeParser(__file)

    # def test_should_parse_grades(self):
    #     grades = self.__parser.extract_grades()
    #     assert len(grades) == 12
