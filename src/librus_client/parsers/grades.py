import logging
from datetime import date
from typing import List, Dict

from bs4 import BeautifulSoup, ResultSet, Tag

from librus_client.model.grades import Grade, Type, SubjectGrades


class GradeParser:
    __logger = logging.getLogger(__name__)
    __soup: BeautifulSoup = None

    __TD_IDX_SUBJECT_NAME = 1
    __TD_IDX_SUBJECT_1_GRADES = 2
    __TD_IDX_SUBJECT_1_AVG = 3
    __TD_IDX_SUBJECT_1_FINAL_GRADE = 4
    __TD_IDX_SUBJECT_2_GRADES = 5
    __TD_IDX_SUBJECT_2_AVG = 6
    __TD_IDX_SUBJECT_2_FINAL_GRADE = 7
    __TD_IDX_SUBJECT_YEAR_AVG = 8
    __TD_IDX_SUBJECT_YEAR_FINAL_GRADE = 9

    def __init__(self, response: str):
        self.__soup = BeautifulSoup(response, 'html.parser')

    def extract_grades(self) -> List[SubjectGrades]:
        all_tables: ResultSet = self.__soup.find('form').find_all('table', {'class': 'decorated stretch'})
        current_grades: List[SubjectGrades] = self.__parse_all_grades(all_tables[0])
        return current_grades

    def __parse_all_grades(self, table: Tag) -> List[SubjectGrades]:
        subjects = table.find_all('tr', {'name': None}, recursive=False)
        return [self.__parse_subject_grades(subject) for subject in subjects[:-1]]  # skip zachowanie for now

    def __parse_subject_grades(self, row: Tag) -> SubjectGrades:
        columns = row.find_all('td')
        subject_name = columns[self.__TD_IDX_SUBJECT_NAME].string
        results: Dict[Type, List[Grade]] = {}
        for grade_type in list(Type):
            results[grade_type] = self.__parse_grades(columns[grade_type.value + 1])

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
