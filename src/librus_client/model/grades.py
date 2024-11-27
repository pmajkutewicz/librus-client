import datetime
from dataclasses import dataclass
from enum import Enum
from typing import List, Dict


class Type(Enum):
    SEMESTER_1_GRADE = 1
    SEMESTER_1_AVG = 2
    SEMESTER_1_FINAL = 3
    SEMESTER_2_GRADE = 4
    SEMESTER_2_AVG = 5
    SEMESTER_2_FINAL = 6
    YEAR_AVG = 7
    YEAR_FINAL = 8


@dataclass
class Grade:
    """Grade entry"""
    id: str
    date: datetime.date
    teacher: str
    category: str
    grade: str
    details: str
    comment: str


@dataclass
class SubjectGrades:
    subject_name: str
    grades: Dict[Type, List[Grade]]
