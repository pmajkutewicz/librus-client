import logging
from datetime import date
from typing import List, Dict

from bs4 import BeautifulSoup, ResultSet, Tag

from librus_client.model.grades import Grade, Type, SubjectGrades


class GradeParser:
    __logger = logging.getLogger(__name__)
    __soup: BeautifulSoup = None

    __TD_IDX_SUBJECT_NAME = 1

    def __init__(self, response: str):
        self.__soup = BeautifulSoup(response, 'html.parser')

    def extract_grades(self) -> List[SubjectGrades]:
        all_tables: ResultSet = self.__soup.find('form').find_all('table', {'class': 'decorated stretch'})
        current_grades: List[SubjectGrades] = self.__parse_all_grades(all_tables[0])
        return current_grades

    @staticmethod
    def __parse_grade_types(table: Tag) -> Dict[int, Type]:
        sem: int = 1
        result: Dict[int, Type] = {}
        descriptions = table.find('thead').find_all('tr')[1].find_all('td')
        for i, tag in enumerate(descriptions, 2):
            if tag.text == 'Oceny bieżące' and sem == 1:
                result[i] = Type.SEMESTER_1_GRADE
                sem = 2
                continue
            if tag.text == "Śr.I":
                result[i] = Type.SEMESTER_1_AVG
                continue
            if tag.text == "(I)":
                result[i] = Type.SEMESTER_1_EXPECTED_FINAL
                continue
            if tag.text == "I":
                result[i] = Type.SEMESTER_1_FINAL
                continue
            if tag.text == 'Oceny bieżące' and sem == 2:
                result[i] = Type.SEMESTER_2_GRADE
                sem = 3
                continue
            if tag.text == "Śr.II":
                result[i] = Type.SEMESTER_2_AVG
                continue
            if tag.text == "II":
                result[i] = Type.SEMESTER_2_FINAL
                continue
            if tag.text == "(II)":
                result[i] = Type.SEMESTER_2_EXPECTED_FINAL
                continue
            if tag.text == "Śr.R":
                result[i] = Type.YEAR_AVG
                continue
            if tag.text == "R":
                result[i] = Type.YEAR_FINAL
                continue

        return result


    def __parse_all_grades(self, table: Tag) -> List[SubjectGrades]:
        subjects = table.find_all('tr', {'name': None}, recursive=False)
        type_index_map = self.__parse_grade_types(table)
        return [self.__parse_subject_grades(subject, type_index_map) for subject in subjects[:-1]]  # skip zachowanie for now

    def __parse_subject_grades(self, row: Tag, type_index_map: Dict[int, Type]) -> SubjectGrades:
        columns = row.find_all('td')
        subject_name = columns[self.__TD_IDX_SUBJECT_NAME].string
        results: Dict[Type, List[Grade]] = {}
        for k, v in type_index_map.items():
            results[v] = self.__parse_grades(columns[k])
        return SubjectGrades(subject_name, results)

    def __parse_grades(self, grades: Tag) -> List[Grade]:
        all_grades = grades.find_all('span')
        return [self.__parse_grade(grade.text.strip(), grade) for grade in all_grades]

    @staticmethod
    def __parse_grade(value: str, span_tag: Tag) -> Grade:
        grade_id = span_tag.get('id')
        title_attr = span_tag.find('a').get('title')
        teacher, category, comment, grade_date, details = None, None, None, None, None
        for text in title_attr.split('<br>'):
            if text.startswith('Kategoria:'):
                category: str = text.split(':')[1].strip()
                continue
            if text.startswith('Data:'):
                date_as_str = text.split(':')[1].strip()
                grade_date = date(int(date_as_str[0:4]), int(date_as_str[5:7]), int(date_as_str[8:10]))
                continue
            if text.startswith('Nauczyciel:'):
                teacher: str = text.split(':')[1].strip()
                continue
            if text.startswith('Komentarz:'):
                comment: str = text.split(':')[1].strip()
                continue
            if text.startswith('Ocena:'):
                details: str = text.split(':')[1].strip()
                continue
        return Grade(grade_id, grade_date, teacher, category, value, details, comment)
